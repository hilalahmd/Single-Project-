import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, ChevronLeft, Dumbbell } from 'lucide-react';

const ClientRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    city: '',
    fitnessGoal: '',
    experienceLevel: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verified, setVerified] = useState(false);

  const fitnessGoals = [
    { id: 'weight-loss', label: 'Weight Loss', desc: 'Burn fat and get lean' },
    { id: 'muscle-gain', label: 'Muscle Gain', desc: 'Build strength and size' },
    { id: 'endurance', label: 'Endurance', desc: 'Improve stamina and cardio' },
    { id: 'flexibility', label: 'Flexibility', desc: 'Mobility and stretching' },
    { id: 'general', label: 'General Fitness', desc: 'Overall health and wellness' },
    { id: 'sports', label: 'Sports Performance', desc: 'Train for your sport' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', desc: 'New to fitness or returning after a break' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Consistent training for 6+ months' },
    { id: 'advanced', label: 'Advanced', desc: 'Training seriously for 2+ years' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    if (step === 2) {
      if (!formData.age) newErrors.age = 'Age is required';
      else if (formData.age < 13 || formData.age > 80) newErrors.age = 'Age must be between 13-80';
      if (!formData.gender) newErrors.gender = 'Please select gender';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }
    if (step === 3) {
      if (!formData.fitnessGoal) newErrors.fitnessGoal = 'Select your fitness goal';
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Select your experience level';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSendOtp = async () => {
    // API call: POST /api/auth/send-otp
    // Body: { email: formData.email, type: 'register' }
    console.log('Sending OTP to:', formData.email);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    // API call: POST /api/auth/verify-otp
    // Body: { email: formData.email, otp: otp, type: 'register' }
    if (otp.length !== 6) {
      setOtpError('Enter 6-digit OTP');
      return;
    }
    console.log('Verifying OTP:', otp);
    setVerified(true);
    setOtpError('');
  };

  const handleResendOtp = async () => {
    // API call: POST /api/auth/send-otp (same as handleSendOtp)
    console.log('Resending OTP to:', formData.email);
    setOtp('');
    setOtpError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
      setCurrentStep(4);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { num: 1, label: 'Account' },
      { num: 2, label: 'Profile' },
      { num: 3, label: 'Goals' }
    ];
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep > step.num ? 'bg-black text-white' : currentStep === step.num ? 'bg-black text-white ring-2 ring-gray-300' : 'bg-gray-200 text-gray-400'}`}>
                {currentStep > step.num ? <CheckCircle size={14} /> : step.num}
              </div>
              <span className={`text-xs mt-1 font-medium ${currentStep >= step.num ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className={`w-12 h-px mx-2 ${currentStep > step.num ? 'bg-black' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" min="13" max="80" className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.age ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kochi, Kerala" className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
        <div className="grid grid-cols-2 gap-2">
          {fitnessGoals.map((goal) => (
            <button key={goal.id} type="button" onClick={() => setFormData(prev => ({ ...prev, fitnessGoal: goal.id }))} className={`p-3 rounded-lg border text-left transition-all ${formData.fitnessGoal === goal.id ? 'border-black bg-gray-100' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className="font-medium text-sm text-gray-900">{goal.label}</div>
              <div className="text-xs text-gray-500">{goal.desc}</div>
            </button>
          ))}
        </div>
        {errors.fitnessGoal && <p className="text-red-500 text-xs mt-1">{errors.fitnessGoal}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <button key={level.id} type="button" onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))} className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${formData.experienceLevel === level.id ? 'border-black bg-gray-100' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.experienceLevel === level.id ? 'border-black' : 'border-gray-300'}`}>
                {formData.experienceLevel === level.id && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900">{level.label}</div>
                <div className="text-xs text-gray-500">{level.desc}</div>
              </div>
            </button>
          ))}
        </div>
        {errors.experienceLevel && <p className="text-red-500 text-xs mt-1">{errors.experienceLevel}</p>}
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-5">
      {!verified ? (
        <>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail size={20} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Verify your email</h3>
            <p className="text-sm text-gray-500 mt-1">We sent a 6-digit code to <span className="font-medium text-gray-700">{formData.email}</span></p>
          </div>

          {!otpSent ? (
            <button onClick={handleSendOtp} className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Send OTP <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className={`w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-lg border bg-white text-gray-900 placeholder-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black ${otpError ? 'border-red-500' : 'border-gray-300'}`} />
                {otpError && <p className="text-red-500 text-xs mt-1 text-center">{otpError}</p>}
              </div>
              <button onClick={handleVerifyOtp} className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all">
                Verify Email
              </button>
              <div className="text-center">
                <button onClick={handleResendOtp} className="text-sm text-gray-500 hover:text-black underline">Resend OTP</button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-black" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h3>
          <p className="text-sm text-gray-500 mb-6">Your account is ready. Complete your registration.</p>
          <button onClick={() => setCurrentStep(5)} className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Complete Registration <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-black" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FitForge!</h2>
      <p className="text-gray-500 text-sm mb-6">Your account has been created successfully.</p>
      <button className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all">
        Go to Dashboard
      </button>
      <p className="mt-4 text-sm text-gray-400">Already have an account? <button className="text-black font-medium hover:underline">Sign In</button></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 border-r border-gray-200 items-center justify-center p-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Dumbbell size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitForge</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">Forge Your Best Self</h1>
          <p className="text-gray-500 leading-relaxed">Join Kerala's premier fitness coaching platform. Connect with expert trainers and achieve your goals.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Dumbbell size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">FitForge</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {currentStep < 4 && (
              <>
                <div className="mb-6">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md mb-3">Client Registration</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentStep === 1 && 'Create your account'}
                    {currentStep === 2 && 'About yourself'}
                    {currentStep === 3 && 'Your fitness goals'}
                  </h2>
                </div>
                {renderProgressBar()}
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  <div className="flex gap-3 mt-6">
                    {currentStep > 1 && <button type="button" onClick={handleBack} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center gap-1"><ChevronLeft size={16} /> Back</button>}
                    {currentStep < 3 ? <button type="button" onClick={handleNext} className="flex-1 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1">Continue <ArrowRight size={16} /></button> : <button type="submit" className="flex-1 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1">Next <ArrowRight size={16} /></button>}
                  </div>
                </form>
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center mb-3">Are you a professional?</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-black hover:text-black transition-all">Trainer Sign Up</button>
                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-black hover:text-black transition-all">Wellness Coach Login</button>
                  </div>
                </div>
              </>
            )}
            {currentStep === 4 && renderOtpStep()}
            {currentStep === 5 && renderSuccess()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage;