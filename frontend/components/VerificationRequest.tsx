import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Upload,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function VerificationRequest() {
  const navigate = useNavigate();
  const [status] = useState<"none" | "pending" | "approved" | "rejected">(
    "none"
  );

  const handleSubmit = () => {
    console.log("Submitting verification request");
    // In real app, this would upload documents and submit request
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-blue-100/50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="p-2 hover:bg-blue-50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">
            Account Verification
          </h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Seamless Card Layout */}
      <div className="bg-white">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 text-center">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Verification
          </h2>
          <p className="text-gray-600">
            Get verified and build trust in your community
          </p>
        </div>

        {status === "none" && (
          <>
            {/* Upload Documents Section */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Verification Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Government ID *
                  </label>
                  <div className="border-2 border-dashed border-blue-300/40 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400/60 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
                    <Upload className="h-10 w-10 mx-auto text-blue-500/70 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Upload ID Document
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Aadhaar, PAN Card, or Passport
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Selfie *
                  </label>
                  <div className="border-2 border-dashed border-indigo-300/40 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400/60 transition-all duration-300 bg-gradient-to-br from-indigo-50/30 to-blue-50/20">
                    <Upload className="h-10 w-10 mx-auto text-indigo-500/70 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Upload Selfie
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Clear photo for verification
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Secure Verification Process
                    </p>
                    <p className="text-sm text-blue-700">
                      Processing typically takes 1-3 business days. Your
                      documents are securely encrypted and only used for
                      verification purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="p-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white py-3 rounded-xl"
              >
                Submit Verification Request
              </Button>
            </div>
          </>
        )}

        {status === "pending" && (
          <div className="p-6 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/25">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Verification Pending
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your documents are being reviewed. This typically takes 1-3
              business days.
            </p>
            <Badge className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              Pending Review
            </Badge>
          </div>
        )}

        {status === "approved" && (
          <div className="p-6 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Verification Approved
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Congratulations! Your verification badge has been added to your
              profile.
            </p>
            <Badge className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        {status === "rejected" && (
          <div className="p-6 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Verification Rejected
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your verification request was rejected. Please ensure documents
              are clear and valid.
            </p>
            <Badge className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
