import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account, databases, storage, ID, Permission, Role } from "@/services/appwriteConfig";
import {
  MapPin, Mail, Lock, User, Phone, MapPinned, Building2,
  Eye, EyeOff, ArrowLeft, Shield, Upload, FileText, CheckCircle, Briefcase
} from "lucide-react";
import { statesData } from "@/states/states";
import { DEPARTMENTS_ARRAY } from "@/constants/departmentConstants";

const Register = () => {
  const navigate = useNavigate();

  // Check if user is already logged in - if yes, redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        // User is logged in, redirect to dashboard
        alert("You are already logged in. Please logout first to register a new account.");
        navigate("/dashboard");
      } catch (error) {
        // User is not logged in, allow registration
      }
    };
    checkAuth();
  }, [navigate]);

  // Form state
  const [role, setRole] = useState("citizen"); // "citizen", "mla", or "official"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  // MLA-specific fields
  const [constituency, setConstituency] = useState("");
  const [partyName, setPartyName] = useState("");
  const [govtIdFile, setGovtIdFile] = useState(null);

  // Official-specific fields
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get districts/constituencies based on selected state
  const districts = state ? statesData[state] : [];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword || !state) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "citizen" && !district) {
      setError("Please select your district");
      return;
    }

    if (role === "mla") {
      if (!constituency) {
        setError("Please select your constituency");
        return;
      }
      if (!govtIdFile) {
        setError("Please upload your government ID proof");
        return;
      }
    }

    if (role === "official") {
      if (!district) {
        setError("Please select your district");
        return;
      }
      if (!department) {
        setError("Please select your department");
        return;
      }
      if (!govtIdFile) {
        setError("Please upload your government ID proof");
        return;
      }
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (role === "citizen") {
        // CITIZEN REGISTRATION - Immediate account creation
        // 1. Create Appwrite auth account
        const authUser = await account.create(ID.unique(), email, password, name);

        // 2. Create user profile in database
        await databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_USERS_COLLECTION_ID,
          authUser.$id,
          {
            userId: authUser.$id,
            name,
            email,
            phone,
            state,
            district,
            role: "citizen",
            status: "active",
          }
        );

        // 3. Success - redirect to login
        alert("Registration successful! Please login to continue. 🎉");
        navigate("/login");

      } else if (role === "mla") {
        // MLA REGISTRATION - Pending approval workflow
        // Note: useEffect ensures only logged-out users can access this page

        // 1. Upload government ID proof
        const uploadedFile = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          govtIdFile
        );

        // 2. Get file URL
        const fileUrl = storage.getFileView(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          uploadedFile.$id
        );

        // 3. Create MLA application (NO user account yet)
        await databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            applicationId: ID.unique(),
            userId: "", // Will be filled when admin approves
            officialType: "MLA",
            name,
            email,
            phone,
            password, // Save password for account creation
            state,
            constituency,
            partyName: partyName || "",
            department: "",
            designation: "",
            govtIdProof: fileUrl.href,
            verificationStatus: "pending",
            appliedAt: new Date().toISOString(),
          }
        );

        // 4. Show success screen (waiting for approval)
        setSuccess(true);

      } else if (role === "official") {
        // DEPARTMENT OFFICIAL REGISTRATION - Pending approval workflow

        // 1. Upload government ID proof
        const uploadedFile = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          govtIdFile
        );

        // 2. Get file URL
        const fileUrl = storage.getFileView(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          uploadedFile.$id
        );

        // 3. Create Official application (NO user account yet)
        await databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            applicationId: ID.unique(),
            userId: "", // Will be filled when admin approves
            officialType: "DEPARTMENT_OFFICIAL",
            name,
            email,
            phone,
            password, // Save password for account creation
            state,
            constituency: district, // Using constituency field for district
            partyName: "",
            department,
            designation: designation || "",
            govtIdProof: fileUrl.href,
            verificationStatus: "pending",
            appliedAt: new Date().toISOString(),
          }
        );

        // 4. Show success screen (waiting for approval)
        setSuccess(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // MLA/Official Success Screen
  if (success && (role === "mla" || role === "official")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your MLA registration application has been submitted successfully.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⏳ Waiting for Admin Approval</strong><br />
              • Your application is under review<br />
              • You'll receive an email notification once approved<br />
              • After approval, you can login using the GovernmentOfficial login option<br />
              • Review usually takes 1-2 business days
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Registration Card */}
      <div className="relative w-full max-w-2xl">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Fix My District community</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am registering as</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`p-3 border-2 rounded-lg transition-all text-center ${role === "citizen"
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <User className={`w-5 h-5 mx-auto mb-1 ${role === "citizen" ? "text-indigo-600" : "text-gray-400"}`} />
                <div className={`font-semibold text-sm ${role === "citizen" ? "text-indigo-900" : "text-gray-700"}`}>
                  Citizen
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Regular user</div>
              </button>

              <button
                type="button"
                onClick={() => setRole("mla")}
                className={`p-3 border-2 rounded-lg transition-all text-center ${role === "mla"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Shield className={`w-5 h-5 mx-auto mb-1 ${role === "mla" ? "text-red-600" : "text-gray-400"}`} />
                <div className={`font-semibold text-sm ${role === "mla" ? "text-red-900" : "text-gray-700"}`}>
                  MLA
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Requires approval</div>
              </button>

              <button
                type="button"
                onClick={() => setRole("official")}
                className={`p-3 border-2 rounded-lg transition-all text-center ${role === "official"
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Briefcase className={`w-5 h-5 mx-auto mb-1 ${role === "official" ? "text-green-600" : "text-gray-400"}`} />
                <div className={`font-semibold text-sm ${role === "official" ? "text-green-900" : "text-gray-700"}`}>
                  Government Official
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Dept. officials</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
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
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* State & District/Constituency */}
            <div className="grid grid-cols-2 gap-4">
              {/* State */}
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
                      setDistrict("");
                      setConstituency("");
                    }}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesData).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District (citizen) or Constituency (MLA) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {role === "mla" ? "Constituency" : "District"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={role === "mla" ? constituency : district}
                    onChange={(e) => role === "mla" ? setConstituency(e.target.value) : setDistrict(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white"
                    disabled={!state}
                    required
                  >
                    <option value="">Select {role === "mla" ? "Constituency" : "District"}</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* MLA-specific fields */}
            {role === "mla" && (
              <>
                {/* Party Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Political Party <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="e.g., INC, BJP, TRS"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Government ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government ID Proof <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition">
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
                          <FileText className="w-6 h-6 text-red-600" />
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
              </>
            )}

            {/* Department Official-specific fields */}
            {role === "official" && (
              <>
                {/* Department & Designation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS_ARRAY.filter(dept => dept.value !== 'MLA').map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.icon} {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g., Assistant Engineer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Government ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government ID Proof <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
                    <input
                      type="file"
                      onChange={(e) => setGovtIdFile(e.target.files[0])}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="govt-id-official"
                      required
                    />
                    <label htmlFor="govt-id-official" className="cursor-pointer">
                      {govtIdFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-6 h-6 text-green-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{govtIdFile.name}</p>
                            <p className="text-xs text-gray-500">{(govtIdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">Click to upload ID proof</p>
                          <p className="text-xs text-gray-500 mt-1">Aadhar Card, Employee ID, or Official Letter</p>
                          <p className="text-xs text-gray-500">PNG, JPG or PDF (max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${role === "mla"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-indigo-500 to-blue-600"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {role === "mla" ? "Submitting Application..." : "Creating Account..."}
                </span>
              ) : (
                role === "mla" ? "Submit Application" : "Create Account"
              )}
            </button>

            {/* MLA Note */}
            {role === "mla" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800">
                  <strong>📋 Note:</strong> Your application will be reviewed by admins.
                  You'll receive email notification once approved. After approval, login using MLA login option.
                </p>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
