import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { actionAlerts, feedbackItems } from '@/data/parentMockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, X } from 'lucide-react';

const ParentCommunicationCenter = () => {
  const navigate = useNavigate();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const activeAlerts = actionAlerts.filter((alert) => !dismissedAlerts.has(alert.id));

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'attention':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <ParentDashboardLayout>
      <div className="space-y-3 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-sm text-gray-500 mt-1">
            View important alerts, respond to teacher notes, and acknowledge updates from school.
          </p>
        </div>

        {/* Grid Layout: Side by side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parent Action Center - Left Column (compact alert list) */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Parent Action Center
                </CardTitle>
                {activeAlerts.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {activeAlerts.length} active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Smart alerts based on your child&apos;s performance, homework and attendance.
              </p>
            </CardHeader>
            <CardContent>
              {activeAlerts.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-3 hover:bg-gray-100 transition-colors"
                    >
                      {/* Severity indicator */}
                      <div className="mt-1">
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold
                            ${
                              alert.severity === 'urgent'
                                ? 'bg-red-100 text-red-700'
                                : alert.severity === 'attention'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }
                          `}
                        >
                          {alert.severity === 'urgent'
                            ? '!'
                            : alert.severity === 'attention'
                            ? '•'
                            : 'i'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {alert.title}
                          </h4>
                          <Badge
                            className={`
                              text-[10px] font-medium border-0
                              ${
                                alert.severity === 'urgent'
                                  ? 'bg-red-50 text-red-700'
                                  : alert.severity === 'attention'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-blue-50 text-blue-700'
                              }
                            `}
                          >
                            {alert.severity === 'urgent'
                              ? 'Urgent'
                              : alert.severity === 'attention'
                              ? 'Needs attention'
                              : 'Info'}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">
                          {alert.description}
                        </p>
                        <p className="text-[11px] text-gray-700 mt-1">
                          💡 {alert.recommendedAction}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 px-3"
                            onClick={() => navigate('/parent/communications')}
                          >
                            Message Teacher
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[11px] h-7 px-3"
                            onClick={() => navigate('/parent/child-progress/1')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="mt-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        aria-label="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-600 font-medium">All good! No action needed.</p>
                  <p className="text-xs text-gray-500 mt-1">Your child is doing well.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback & Acknowledgement - Right Column (timeline style) */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Feedback & Acknowledgement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {feedbackItems
                  .filter((item) => item.status === 'pending')
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.id} className="relative pl-5">
                      {/* Timeline dot & line */}
                      <div className="absolute left-0 top-2 flex flex-col items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {index !== 4 && (
                          <span className="w-px flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors">
                        <h4 className="text-xs font-semibold text-gray-800 mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-600 mb-2 line-clamp-2">
                          {item.content}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-gray-500">
                            Tap acknowledge to confirm you’ve seen this update.
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px] h-6 px-2"
                              onClick={() => {
                                // In real app, this would update the status
                                console.log('Acknowledged:', item.id);
                              }}
                            >
                              ✓ Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[11px] h-6 px-2"
                              onClick={() => navigate('/parent/communications')}
                            >
                              Clarify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {feedbackItems.filter((item) => item.status === 'pending').length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-xs text-gray-600">All items acknowledged</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentCommunicationCenter;

