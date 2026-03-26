"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { toast } from "react-toastify";

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  additionalData?: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    jobTitle?: string;
    companySize?: string;
    industry?: string;
    website?: string;
    marketingGoals?: string[];
    monthlyBudget?: string;
    marketingTools?: string[];
  };
  subscription?: {
    id: string;
    name?: string;
    subscriptionName?: string;
    type: string;
    amount: number;
    duration: number;
    details?: string;
    createdAt?: string;
  };
}

// Helper function to format plan information
const formatPlanInfo = (subscription: UserData["subscription"]) => {
  if (!subscription) {
    return {
      name: "Free",
      type: "Basic plan",
      amount: null,
      duration: null,
      amountText: "",
      isLifetime: false,
    };
  }

  const planName =
    subscription.subscriptionName || subscription.name || "Unknown Plan";

  let planType = "Basic plan";
  if (subscription.type === "lifetime") {
    planType = "Lifetime plan";
  } else if (subscription.type === "monthly") {
    planType = "Monthly plan";
  } else {
    planType = `${subscription.type} plan`;
  }

  const isLifetime =
    subscription.type === "lifetime" || subscription.duration === 0;
  const amountText = isLifetime
    ? `${subscription.amount} (Lifetime)`
    : `${subscription.amount}/month`;

  return {
    name: planName,
    type: planType,
    amount: subscription.amount,
    duration: subscription.duration,
    amountText,
    isLifetime,
  };
};

export default function Account() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    jobTitle: "",
    website: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const storedUserData = localStorage.getItem("userData");

      if (!token || !storedUserData) {
        router.push("/login");
        return;
      }

      // Fetch latest user data from database
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);

            // Initialize edit form with current user data
            const additionalData = data.user.additionalData || {};
            setEditForm({
              firstName:
                additionalData.firstName || data.user.name?.split(" ")[0] || "",
              lastName:
                additionalData.lastName || data.user.name?.split(" ")[1] || "",
              email: data.user.email || "",
              companyName: additionalData.companyName || "",
              jobTitle: additionalData.jobTitle || "",
              website: additionalData.website || "",
            });
          } else {
            // Fallback to localStorage data if API fails
            const user = JSON.parse(storedUserData);
            setUserData(user);

            const userAdditionalData = user.additionalData || {};
            setEditForm({
              firstName:
                userAdditionalData.firstName || user.name?.split(" ")[0] || "",
              lastName:
                userAdditionalData.lastName || user.name?.split(" ")[1] || "",
              email: user.email || "",
              companyName: userAdditionalData.companyName || "",
              jobTitle: userAdditionalData.jobTitle || "",
              website: userAdditionalData.website || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to localStorage data
          const user = JSON.parse(storedUserData);
          setUserData(user);

          const userAdditionalData = user.additionalData || {};
          setEditForm({
            firstName:
              userAdditionalData.firstName || user.name?.split(" ")[0] || "",
            lastName:
              userAdditionalData.lastName || user.name?.split(" ")[1] || "",
            email: user.email || "",
            companyName: userAdditionalData.companyName || "",
            jobTitle: userAdditionalData.jobTitle || "",
            website: userAdditionalData.website || "",
          });
        }
      };

      fetchUserData();
    }
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout API to track session
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
      // Continue with logout even if API call fails
    }

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Show success notification
    toast.success("👋 Logged out successfully! See you soon.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: "logout-success",
    });

    // Redirect to login page after a short delay to show the toast
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user data
      setUserData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: `${editForm.firstName} ${editForm.lastName}`,
          email: editForm.email,
          additionalData: {
            ...prev.additionalData,
            companyName: editForm.companyName,
            jobTitle: editForm.jobTitle,
            website: editForm.website,
          },
        };
      });

      setIsEditing(false);

      // Show success notification
      toast.success(
        "Profile updated successfully! Your changes have been saved.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } catch (error) {
      console.error("Error saving changes:", error);

      // Show error notification
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex overflow-x-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading account details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Subscription History Component
  const SubscriptionHistory: React.FC = () => {
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(
      null
    );

    useEffect(() => {
      fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : null;

        const response = await fetch(
          `/api/user/membership?userId=${user?.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Remove duplicates based on subscriptionId, amount, and date
          const uniquePayments = (data.paymentHistory || []).filter(
            (payment: any, index: number, self: any[]) => {
              // Find the first occurrence of a payment with the same subscriptionId and amount
              const firstOccurrence = self.findIndex(
                (p) =>
                  p.subscriptionId === payment.subscriptionId &&
                  p.amount === payment.amount &&
                  // Check if the dates are very close (within 2 minutes) - likely duplicates
                  Math.abs(
                    new Date(p.createdDate).getTime() -
                      new Date(payment.createdDate).getTime()
                  ) < 120000
              );

              // Only keep the first occurrence (index === firstOccurrence)
              return index === firstOccurrence;
            }
          );

          setPaymentHistory(uniquePayments);
        } else {
          throw new Error("Failed to fetch payment history");
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError("Failed to load payment history");
        // Show only one toast notification for payment history errors
        toast.error("Failed to load payment history. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          toastId: "payment-history-error", // Use unique ID to prevent duplicates
        });
      } finally {
        setLoading(false);
      }
    };

    const downloadInvoice = async (paymentId: string, invoiceUrl?: string) => {
      try {
        setDownloadingInvoice(paymentId);

        // Show loading toast
        toast.info("🔄 Generating receipt...", {
          position: "top-right",
          autoClose: 2000,
          toastId: `loading-receipt-${paymentId}`, // Unique ID for each payment
        });

        if (invoiceUrl) {
          // If invoice URL exists, download directly without opening new tab
          try {
            const response = await fetch(invoiceUrl);
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt-${paymentId}-${
              new Date().toISOString().split("T")[0]
            }.pdf`;
            a.style.display = "none";

            // Add to DOM and trigger download
            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);

            toast.success("✅ Receipt downloaded successfully!", {
              position: "top-right",
              autoClose: 3000,
              toastId: `success-receipt-${paymentId}`, // Unique ID for each payment
            });
          } catch (error) {
            throw new Error("Failed to download receipt from URL");
          }
        } else {
          // Generate invoice PDF
          const token = localStorage.getItem("authToken");

          if (!token) {
            throw new Error("Authentication required. Please login again.");
          }

          const response = await fetch(
            `/api/user/membership/invoice/${paymentId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const blob = await response.blob();

            // Check if blob is valid
            if (blob.size === 0) {
              throw new Error("Generated invoice is empty");
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt-${paymentId}-${
              new Date().toISOString().split("T")[0]
            }.pdf`;
            a.style.display = "none";

            // Add to DOM and trigger download
            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);

            // Show success toast
            toast.success("✅ Receipt downloaded successfully!", {
              position: "top-right",
              autoClose: 3000,
              toastId: `success-receipt-${paymentId}`, // Unique ID for each payment
            });
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `HTTP ${response.status}: Failed to generate receipt`
            );
          }
        }
      } catch (error) {
        console.error("Error downloading invoice:", error);

        // Show error toast with more details
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`❌ Failed to download receipt: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          toastId: `error-receipt-${paymentId}`, // Unique ID for each payment
        });
      } finally {
        setDownloadingInvoice(null);
      }
    };

    const downloadSubscriptionInvoice = async (subscriptionId: string) => {
      try {
        setDownloadingInvoice(subscriptionId);

        // Show loading toast
        toast.info("🔄 Generating subscription invoice...", {
          position: "top-right",
          autoClose: 2000,
          toastId: `loading-subscription-${subscriptionId}`, // Unique ID for each subscription
        });

        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        const response = await fetch(
          `/api/user/membership/invoice/subscription/${subscriptionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();

          // Check if blob is valid
          if (blob.size === 0) {
            throw new Error("Generated subscription invoice is empty");
          }

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `subscription-invoice-${subscriptionId}-${
            new Date().toISOString().split("T")[0]
          }.pdf`;
          a.style.display = "none";

          // Add to DOM and trigger download
          document.body.appendChild(a);
          a.click();

          // Cleanup
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 100);

          // Show success toast
          toast.success("✅ Subscription invoice downloaded successfully!", {
            position: "top-right",
            autoClose: 3000,
            toastId: `success-subscription-${subscriptionId}`, // Unique ID for each subscription
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `HTTP ${response.status}: Failed to generate subscription invoice`
          );
        }
      } catch (error) {
        console.error("Error downloading subscription invoice:", error);

        // Show error toast with more details
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(
          `❌ Failed to download subscription invoice: ${errorMessage}`,
          {
            position: "top-right",
            autoClose: 5000,
            toastId: `error-subscription-${subscriptionId}`, // Unique ID for each subscription
          }
        );
      } finally {
        setDownloadingInvoice(null);
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "success":
          return "bg-green-100 text-green-800 border-green-200";
        case "failed":
          return "bg-red-100 text-red-800 border-red-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "success":
          return "fas fa-check-circle";
        case "failed":
          return "fas fa-times-circle";
        case "pending":
          return "fas fa-clock";
        default:
          return "fas fa-circle";
      }
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading subscription history...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchPaymentHistory}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (paymentHistory.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="fas fa-receipt text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium">
              No payment history found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Your subscription payments will appear here
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Subscription History
          </h2>
          <button
            onClick={fetchPaymentHistory}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            title="Refresh and remove duplicates"
          >
            <i className="fas fa-sync-alt mr-1"></i>
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-credit-card text-blue-600 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {payment.subscriptionName || "Subscription Payment"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.createdDate
                          ? formatDate(payment.createdDate)
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      <i
                        className={`${getStatusIcon(payment.status)} mr-1`}
                      ></i>
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>

                    {payment.subscriptionId && (
                      <span className="text-xs text-gray-500">
                        ID: {payment.subscriptionId.slice(-8)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {payment.subscriptionId && (
                    <button
                      onClick={() =>
                        downloadSubscriptionInvoice(payment.subscriptionId)
                      }
                      disabled={downloadingInvoice === payment.subscriptionId}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      title="Download Subscription Invoice"
                    >
                      {downloadingInvoice === payment.subscriptionId ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-invoice"></i>
                          <span>Subscription Invoice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Payments:</span>
              <p className="text-lg font-semibold text-gray-900">
                {paymentHistory.length}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Amount:</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  paymentHistory.reduce(
                    (sum, payment) => sum + payment.amount,
                    0
                  )
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Payment:</span>
              <p className="text-lg font-semibold text-gray-900">
                {paymentHistory.length > 0
                  ? formatDate(paymentHistory[0].createdDate)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex overflow-x-hidden bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <i className="fas fa-user-circle text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your profile and subscription
                </p>
              </div>
            </div>
            {/* Hidden header actions (All Tools / Logout) */}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Hero Welcome Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 mb-8 border border-slate-200 relative overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-4 sm:gap-6">
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-slate-100 rounded-2xl p-3 sm:p-4 flex-shrink-0">
                      <i className="fas fa-user text-2xl text-slate-600"></i>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                          👋 Welcome Back
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                          ✨ {userData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 break-words">
                        Hello, {userData.name?.split(" ")[0] || "User"}!
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-600 mb-6">
                    Manage your account, track your usage, and customize your
                    Markzy experience.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-slate-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                        <i className="fas fa-tools text-slate-600 text-sm"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-800">
                          Tools Access
                        </span>
                        <p className="text-xs text-slate-600">100+ AI Tools</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-slate-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center">
                        <i className="fas fa-crown text-slate-600 text-sm"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-800">
                          {formatPlanInfo(userData.subscription).name} Plan
                        </span>
                        <p className="text-xs text-slate-600">
                          {formatPlanInfo(userData.subscription).type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-slate-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center">
                        <i className="fas fa-calendar-check text-slate-600 text-sm"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-800">
                          Member Since
                        </span>
                        <p className="text-xs text-slate-600">
                          {userData.createdAt
                            ? new Date(userData.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : `${new Date().getFullYear()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
            </div>
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-user-edit text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h3>
                  <p className="text-gray-500">
                    Update your personal details and preferences
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isEditing
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <i className={`fas fa-${isEditing ? "times" : "edit"}`}></i>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={editForm.companyName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={editForm.jobTitle}
                        onChange={(e) =>
                          setEditForm({ ...editForm, jobTitle: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your job title"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) =>
                        setEditForm({ ...editForm, website: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-blue-700">
                        Full Name
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.name}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-envelope text-green-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-green-700">
                        Email Address
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.email}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-user-tag text-purple-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-purple-700">
                        Role
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.role || "User"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-building text-orange-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-orange-700">
                        Company
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData?.companyName || "Not specified"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-briefcase text-pink-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-pink-700">
                        Job Title
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData?.jobTitle || "Not specified"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-globe text-teal-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-teal-700">
                        Website
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData?.website ? (
                        <a
                          href={userData.additionalData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {userData.additionalData.website.replace(
                            /(https?:\/\/)?(www\.)?/,
                            ""
                          )}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Statistics Dashboard */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Account Overview
                  </h3>
                  <p className="text-gray-500">
                    Your activity and membership details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-tools text-white text-lg"></i>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      This Month
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Tools Used</h4>
                  <p className="text-3xl font-black text-blue-600 mb-2">0</p>
                  <p className="text-sm text-gray-600">AI tools accessed</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-calendar text-white text-lg"></i>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {userData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Member Since</h4>
                  {userData.subscription && userData.subscription.createdAt
                    ? (() => {
                        const subscriptionDate = new Date(
                          userData.subscription.createdAt
                        );
                        const year = subscriptionDate.getFullYear();
                        const month = subscriptionDate.toLocaleString(
                          "default",
                          { month: "long" }
                        );
                        const day = subscriptionDate.getDate();
                        return (
                          <>
                            <p className="text-3xl font-black text-green-600 mb-1">
                              {day}
                            </p>
                            <p className="text-lg font-semibold text-green-700 mb-1">
                              {month} {year}
                            </p>
                          </>
                        );
                      })()
                    : (() => {
                        // Use account creation date if available, otherwise use current date
                        const accountDate = userData?.createdAt
                          ? new Date(userData.createdAt)
                          : new Date();
                        const year = accountDate.getFullYear();
                        const month = accountDate.toLocaleString("default", {
                          month: "long",
                        });
                        const day = accountDate.getDate();
                        return (
                          <>
                            <p className="text-3xl font-black text-green-600 mb-1">
                              {day}
                            </p>
                            <p className="text-lg font-semibold text-green-700 mb-1">
                              {month} {year}
                            </p>
                          </>
                        );
                      })()}
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-crown text-white text-lg"></i>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        formatPlanInfo(userData.subscription).isLifetime
                          ? "bg-gold-100 text-gold-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {formatPlanInfo(userData.subscription).isLifetime
                        ? "Lifetime"
                        : "Active"}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Current Plan</h4>
                  <p className="text-3xl font-black text-purple-600 mb-2">
                    {formatPlanInfo(userData.subscription).name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatPlanInfo(userData.subscription).type}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-star text-white text-lg"></i>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Premium
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Features</h4>
                  <p className="text-3xl font-black text-amber-600 mb-2">
                    100+
                  </p>
                  <p className="text-sm text-gray-600">AI marketing tools</p>
                </div>
              </div>

              {/* Subscription Details Card */}
              {userData.subscription && (
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-gem text-white"></i>
                    </div>
                    <h4 className="text-xl font-bold text-indigo-800">
                      Subscription Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Plan Type
                      </span>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        {(() => {
                          const planInfo = formatPlanInfo(
                            userData.subscription
                          );
                          return planInfo.isLifetime
                            ? "Lifetime Access"
                            : userData.subscription.type === "monthly"
                            ? "Monthly Plan"
                            : userData.subscription.type;
                        })()}
                      </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Amount
                      </span>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        ${userData.subscription.amount}
                      </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Duration
                      </span>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        {(() => {
                          const planInfo = formatPlanInfo(
                            userData.subscription
                          );
                          return planInfo.isLifetime
                            ? "Forever ♾️"
                            : `${userData.subscription.duration} days`;
                        })()}
                      </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Status
                      </span>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        Active ✅
                      </p>
                    </div>
                    {(() => {
                      const planInfo = formatPlanInfo(userData.subscription);
                      if (!planInfo.isLifetime) {
                        const subscriptionDate = new Date(
                          userData.subscription.createdAt || new Date()
                        );
                        const expiryDate = new Date(
                          subscriptionDate.getTime() + 30 * 24 * 60 * 60 * 1000
                        );
                        return (
                          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl md:col-span-2 lg:col-span-4">
                            <span className="font-semibold text-gray-700">
                              Expires On
                            </span>
                            <p className="text-lg font-bold text-indigo-600 mt-1">
                              {expiryDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  {userData.subscription.details && (
                    <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Plan Details
                      </span>
                      <p className="text-gray-700 mt-2">
                        {userData.subscription.details}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subscription History */}
            <SubscriptionHistory />

            {/* Marketing Preferences */}
            {userData.additionalData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-bullseye text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Marketing Preferences
                    </h3>
                    <p className="text-gray-500">
                      Your business details and marketing goals
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-industry text-blue-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-blue-700">
                        Industry
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData.industry || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-users text-green-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-green-700">
                        Company Size
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData.companySize || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-dollar-sign text-purple-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-purple-700">
                        Monthly Budget
                      </label>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.additionalData.monthlyBudget || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-target text-orange-600"></i>
                      </div>
                      <label className="text-sm font-semibold text-orange-700">
                        Marketing Goals
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userData.additionalData.marketingGoals &&
                      userData.additionalData.marketingGoals.length > 0 ? (
                        userData.additionalData.marketingGoals.map(
                          (goal, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200"
                            >
                              {goal}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No goals specified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-bolt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Quick Actions
                  </h3>
                  <p className="text-gray-500">
                    Access your most important features
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!userData.subscription ? (
                  <Link
                    href="/upgrade-account"
                    className="group p-6 border-2 border-amber-200 rounded-2xl hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <i className="fas fa-crown text-white text-lg"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          Upgrade Account
                        </h4>
                        <p className="text-sm text-gray-600">
                          Unlock premium features and tools
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-amber-600 font-medium">
                            Get Started
                          </span>
                          <i className="fas fa-arrow-right text-xs text-amber-600 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/upgrade-account"
                    className="group p-6 border-2 border-green-200 rounded-2xl hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <i className="fas fa-sync text-white text-lg"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          Manage Subscription
                        </h4>
                        <p className="text-sm text-gray-600">
                          Update your plan or billing info
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-green-600 font-medium">
                            Manage
                          </span>
                          <i className="fas fa-arrow-right text-xs text-green-600 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className="group p-6 border-2 border-blue-200 rounded-2xl hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <i className="fas fa-chart-line text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        View Dashboard
                      </h4>
                      <p className="text-sm text-gray-600">
                        Check your analytics and progress
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-blue-600 font-medium">
                          Open
                        </span>
                        <i className="fas fa-arrow-right text-xs text-blue-600 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/all-tools"
                  className="group p-6 border-2 border-purple-200 rounded-2xl hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <i className="fas fa-tools text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        All AI Tools
                      </h4>
                      <p className="text-sm text-gray-600">
                        Access 100+ marketing tools
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-purple-600 font-medium">
                          Explore
                        </span>
                        <i className="fas fa-arrow-right text-xs text-purple-600 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/knowledge-base"
                  className="group p-6 border-2 border-teal-200 rounded-2xl hover:border-teal-300 hover:bg-gradient-to-br hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <i className="fas fa-book-open text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        Knowledge Base
                      </h4>
                      <p className="text-sm text-gray-600">
                        Learn marketing best practices
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-teal-600 font-medium">
                          Learn
                        </span>
                        <i className="fas fa-arrow-right text-xs text-teal-600 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/start-here"
                  className="group p-6 border-2 border-emerald-200 rounded-2xl hover:border-emerald-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <i className="fas fa-play text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        Getting Started
                      </h4>
                      <p className="text-sm text-gray-600">
                        Complete your setup process
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-emerald-600 font-medium">
                          Start
                        </span>
                        <i className="fas fa-arrow-right text-xs text-emerald-600 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
