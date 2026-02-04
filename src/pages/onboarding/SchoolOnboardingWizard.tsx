import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { schoolOnboardingApi, type SchoolOnboardingInvite, type OnboardingStepData } from '@/services/superAdminApi';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type WizardStep = 'school_profile' | 'academic_setup' | 'teacher_setup' | 'platform_preferences' | 'review_submit';

const SchoolOnboardingWizard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const [currentStep, setCurrentStep] = useState<WizardStep>('school_profile');
  const [stepData, setStepData] = useState<OnboardingStepData>({});

  const { data: progressData, isLoading, isError, error } = useQuery<{
    invite: SchoolOnboardingInvite;
    stepData?: OnboardingStepData;
  }>({
    queryKey: ['school-onboarding', token],
    queryFn: () => schoolOnboardingApi.getOnboardingProgress(token!),
    enabled: !!token,
  });

  const saveStepMutation = useMutation({
    mutationFn: async ({ step, data }: { step: keyof OnboardingStepData; data: any }) => {
      return await schoolOnboardingApi.saveOnboardingStep(token!, step, data);
    },
    onSuccess: () => {
      toast({
        title: 'Progress Saved',
        description: 'Your progress has been saved.',
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await schoolOnboardingApi.submitOnboarding(token!);
    },
    onSuccess: () => {
      toast({
        title: 'Onboarding Submitted',
        description: 'Your onboarding application has been submitted for review.',
      });
      navigate('/');
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please complete all required steps',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (progressData?.stepData) {
      setStepData(progressData.stepData);
    }
  }, [progressData]);

  // Initialize form data from saved step data
  const [schoolProfile, setSchoolProfile] = useState({
    schoolName: progressData?.stepData?.schoolProfile?.schoolName || progressData?.invite?.schoolName || '',
    academicYear: progressData?.stepData?.schoolProfile?.academicYear || '2024-2025',
  });

  const [academicSetup, setAcademicSetup] = useState({
    classes: progressData?.stepData?.academicSetup?.classes || [],
    sections: progressData?.stepData?.academicSetup?.sections || {},
    subjectsPerClass: progressData?.stepData?.academicSetup?.subjectsPerClass || {},
  });

  const [teachers, setTeachers] = useState<Array<{ name: string; email: string; subject?: string }>>(
    progressData?.stepData?.teacherSetup?.teachers || []
  );

  const [platformPreferences, setPlatformPreferences] = useState({
    languagePreference: progressData?.stepData?.platformPreferences?.languagePreference || 'en',
    notificationSettings: progressData?.stepData?.platformPreferences?.notificationSettings || { email: true, sms: false },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <EmptyState
              icon={AlertCircle}
              title="Invalid Access"
              description="A valid onboarding token is required to access this page."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState message="Loading onboarding..." />
      </div>
    );
  }

  if (isError || !progressData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <EmptyState
              icon={AlertCircle}
              title="Invalid or Expired Token"
              description={error?.message || "The onboarding token is invalid or has expired. Please contact support."}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps: { id: WizardStep; label: string }[] = [
    { id: 'school_profile', label: 'School Profile' },
    { id: 'academic_setup', label: 'Academic Setup' },
    { id: 'teacher_setup', label: 'Teacher Setup' },
    { id: 'platform_preferences', label: 'Platform Preferences' },
    { id: 'review_submit', label: 'Review & Submit' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = progressData.invite.onboardingProgress;

  const handleNext = async () => {
    if (currentStep === 'school_profile') {
      await saveStepMutation.mutateAsync({
        step: 'schoolProfile',
        data: schoolProfile,
      });
      setCurrentStep('academic_setup');
    } else if (currentStep === 'academic_setup') {
      await saveStepMutation.mutateAsync({
        step: 'academicSetup',
        data: academicSetup,
      });
      setCurrentStep('teacher_setup');
    } else if (currentStep === 'teacher_setup') {
      await saveStepMutation.mutateAsync({
        step: 'teacherSetup',
        data: { teachers },
      });
      setCurrentStep('platform_preferences');
    } else if (currentStep === 'platform_preferences') {
      await saveStepMutation.mutateAsync({
        step: 'platformPreferences',
        data: platformPreferences,
      });
      setCurrentStep('review_submit');
    }
  };

  const handleBack = () => {
    if (currentStep === 'academic_setup') {
      setCurrentStep('school_profile');
    } else if (currentStep === 'teacher_setup') {
      setCurrentStep('academic_setup');
    } else if (currentStep === 'platform_preferences') {
      setCurrentStep('teacher_setup');
    } else if (currentStep === 'review_submit') {
      setCurrentStep('platform_preferences');
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const addClass = () => {
    const newClass = `Class ${academicSetup.classes.length + 1}`;
    setAcademicSetup({
      ...academicSetup,
      classes: [...academicSetup.classes, newClass],
      sections: { ...academicSetup.sections, [newClass]: ['A'] },
      subjectsPerClass: { ...academicSetup.subjectsPerClass, [newClass]: [] },
    });
  };

  const removeClass = (className: string) => {
    const newClasses = academicSetup.classes.filter(c => c !== className);
    const newSections = { ...academicSetup.sections };
    const newSubjects = { ...academicSetup.subjectsPerClass };
    delete newSections[className];
    delete newSubjects[className];
    setAcademicSetup({
      classes: newClasses,
      sections: newSections,
      subjectsPerClass: newSubjects,
    });
  };

  const addTeacher = () => {
    setTeachers([...teachers, { name: '', email: '', subject: '' }]);
  };

  const removeTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  const updateTeacher = (index: number, field: string, value: string) => {
    const updated = [...teachers];
    updated[index] = { ...updated[index], [field]: value };
    setTeachers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>School Onboarding</CardTitle>
            <CardDescription>
              Complete the onboarding process to activate your school on the EDDGE platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    idx <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx < currentStepIndex ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    idx < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {currentStep === 'school_profile' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={schoolProfile.schoolName}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, schoolName: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    value={schoolProfile.academicYear}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, academicYear: e.target.value })}
                    placeholder="2024-2025"
                  />
                </div>
                <div>
                  <Label htmlFor="logo">School Logo (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'academic_setup' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Classes & Sections *</Label>
                  <Button variant="outline" size="sm" onClick={addClass}>
                    Add Class
                  </Button>
                </div>
                {academicSetup.classes.map((className) => (
                  <Card key={className} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{className}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClass(className)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Sections (comma-separated)</Label>
                        <Input
                          value={academicSetup.sections[className]?.join(', ') || ''}
                          onChange={(e) => {
                            const sections = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setAcademicSetup({
                              ...academicSetup,
                              sections: { ...academicSetup.sections, [className]: sections },
                            });
                          }}
                          placeholder="A, B, C"
                        />
                      </div>
                      <div>
                        <Label>Subjects (comma-separated)</Label>
                        <Input
                          value={academicSetup.subjectsPerClass[className]?.join(', ') || ''}
                          onChange={(e) => {
                            const subjects = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setAcademicSetup({
                              ...academicSetup,
                              subjectsPerClass: { ...academicSetup.subjectsPerClass, [className]: subjects },
                            });
                          }}
                          placeholder="Mathematics, Science, English"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                {academicSetup.classes.length === 0 && (
                  <Alert>
                    <AlertDescription>Add at least one class to continue.</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {currentStep === 'teacher_setup' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Teachers (Optional - Can be skipped)</Label>
                  <Button variant="outline" size="sm" onClick={addTeacher}>
                    Add Teacher
                  </Button>
                </div>
                {teachers.map((teacher, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Teacher {idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeacher(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Name"
                        value={teacher.name}
                        onChange={(e) => updateTeacher(idx, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={teacher.email}
                        onChange={(e) => updateTeacher(idx, 'email', e.target.value)}
                      />
                      <Input
                        placeholder="Subject"
                        value={teacher.subject || ''}
                        onChange={(e) => updateTeacher(idx, 'subject', e.target.value)}
                      />
                    </div>
                  </Card>
                ))}
                {teachers.length === 0 && (
                  <Alert>
                    <AlertDescription>You can skip this step and add teachers later.</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {currentStep === 'platform_preferences' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Language Preference</Label>
                  <Select
                    value={platformPreferences.languagePreference}
                    onValueChange={(value) =>
                      setPlatformPreferences({ ...platformPreferences, languagePreference: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notification Settings</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Badge variant={platformPreferences.notificationSettings.email ? 'default' : 'secondary'}>
                        {platformPreferences.notificationSettings.email ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Notifications</span>
                      <Badge variant={platformPreferences.notificationSettings.sms ? 'default' : 'secondary'}>
                        {platformPreferences.notificationSettings.sms ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    These are default settings. They can be changed later.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'review_submit' && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please review all information before submitting. Once submitted, your application will be reviewed by SuperAdmin.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">School Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Name:</strong> {schoolProfile.schoolName}</p>
                      <p><strong>Academic Year:</strong> {schoolProfile.academicYear}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Classes:</strong> {academicSetup.classes.join(', ')}</p>
                    </CardContent>
                  </Card>
                  {teachers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Teachers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Count:</strong> {teachers.length}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0 || saveStepMutation.isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep === 'review_submit' ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 'school_profile' && !schoolProfile.schoolName) ||
                    (currentStep === 'academic_setup' && academicSetup.classes.length === 0) ||
                    saveStepMutation.isPending
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolOnboardingWizard;

