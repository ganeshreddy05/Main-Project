import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { databases, storage, ID } from "@/services/appwriteConfig";
import {
    Shield, Mail, Phone, User, MapPinned, Building2,
    Upload, ArrowLeft, AlertCircle, CheckCircle, FileText
} from "lucide-react";
import { statesData } from "@/states/states";

const MLARegister = () => {
    const navigate = useNavigate();

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [state, setState] = useState("");
    const [constituency, setConstituency] = useState("");
    const [partyName, setPartyName] = useState("");
    const [govtIdFile, setGovtIdFile] = useState(null);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Get constituencies based on selected state
    const constituencies = state ? statesData[state] : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // 1. Validate file
            if (!govtIdFile) {
                setError("Please upload your government ID proof");
                setIsLoading(false);
                return;
            }

            // 2. Upload ID proof to storage
            const uploadedFile = await storage.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                ID.unique(),
                govtIdFile
            );

            // 3. Get file URL
            const fileUrl = storage.getFileView(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                uploadedFile.$id
            );

            // 4. Create MLA application
            await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
                ID.unique(),
                {
                    applicationId: ID.unique(),
                    userId: "", // Will be filled when admin approves
                    name,
                    email,
                    phone,
                    state,
                    constituency,
                    partyName: partyName || "",
                    govtIdProof: fileUrl.href,
                    verificationStatus: "pending",
                    appliedAt: new Date().toISOString(),
                }
            );

            setSuccess(true);

            // Reset form
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } catch (err) {
            console.error("Application error:", err);
            setError(err.message || "Failed to submit application. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-4">
                        Your MLA application has been submitted successfully. Our admin team will review your application and notify you via email.
                    </p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-purple-800">
                            <strong>What's next?</strong><br />
                            - Admin will review your documents<br />
                            - You'll receive an email notification<br />
                            - Approval usually takes 1-2 business days
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            </div>

            {/* Registration Card */}
            <div className="relative w-full max-w-2xl">
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                    <span className="font-medium">Back to Home</span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">MLA Registration</h1>
                        <p className="text-gray-600">Apply for MLA portal access</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91-XXXXXXXXXX"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* State & Constituency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            setConstituency("");
                                        }}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(statesData).map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Constituency <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select
                                        value={constituency}
                                        onChange={(e) => setConstituency(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition appearance-none bg-white"
                                        disabled={!state}
                                        required
                                    >
                                        <option value="">Select Constituency</option>
                                        {constituencies.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Party Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Political Party (Optional)
                            </label>
                            <input
                                type="text"
                                value={partyName}
                                onChange={(e) => setPartyName(e.target.value)}
                                placeholder="e.g., INC, BJP, TRS"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Government ID Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Government ID Proof <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
                                <input
                                    type="file"
                                    onChange={(e) => setGovtIdFile(e.target.files[0])}
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    id="govt-id"
                                    required
                                />
                                <label htmlFor="govt-id" className="cursor-pointer">
                                    {govtIdFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileText className="w-6 h-6 text-purple-600" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">{govtIdFile.name}</p>
                                                <p className="text-xs text-gray-500">{(govtIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Click to upload ID proof</p>
                                            <p className="text-xs text-gray-500 mt-1">Aadhar Card, PAN Card, or Official Letter</p>
                                            <p className="text-xs text-gray-500">PNG, JPG or PDF (max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting Application...
                                </span>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </form>

                    {/* Important Note */}
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-xs text-purple-800">
                            <strong>📋 Note:</strong> Your application will be reviewed by our admin team.
                            You'll receive an email notification once your application is approved.
                            Please ensure all information is accurate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLARegister;
