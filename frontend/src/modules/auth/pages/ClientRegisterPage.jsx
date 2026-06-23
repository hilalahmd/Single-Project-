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
    console.log('Sending OTP to:', formData.email);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Enter 6-digit OTP');
      return;
    }
    console.log('Verifying OTP:', otp);
    setVerified(true);
    setOtpError('');
  };

  const handleResendOtp = async () => {
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep > step.num ? 'bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' : currentStep === step.num ? 'bg-[#111827] text-[#2563EB] border-2 border-[#2563EB]' : 'bg-[#0F172A] border border-[#1E293B] text-gray-500'}`}>
                {currentStep > step.num ? <CheckCircle size={14} /> : step.num}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= step.num ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className={`w-12 h-px mx-2 ${currentStep > step.num ? 'bg-[#2563EB]' : 'bg-[#1E293B]'}`} />}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Full Name</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.fullName ? 'border-red-500' : 'border-[#1E293B]'}`} />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.email ? 'border-red-500' : 'border-[#1E293B]'}`} />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.password ? 'border-red-500' : 'border-[#1E293B]'}`} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-[#1E293B]'}`} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" min="13" max="80" className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.age ? 'border-red-500' : 'border-[#1E293B]'}`} />
          {errors.age && <p className="text-red-500 text-xs mt-1.5">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.gender ? 'border-red-500' : 'border-[#1E293B]'}`}>
            <option value="" className="bg-[#0F172A]">Select</option>
            <option value="male" className="bg-[#0F172A]">Male</option>
            <option value="female" className="bg-[#0F172A]">Female</option>
            <option value="other" className="bg-[#0F172A]">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1.5">{errors.gender}</p>}
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-gray-300 mb-1.5">City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kochi, Kerala" className={`w-full px-4 py-3 rounded-xl border bg-[#0F172A] text-white placeholder-gray-500 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.city ? 'border-red-500' : 'border-[#1E293B]'}`} />
        {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-[14px] font-semibold text-gray-300 mb-3">Fitness Goal</label>
        <div className="grid grid-cols-2 gap-3">
          {fitnessGoals.map((goal) => (
            <button key={goal.id} type="button" onClick={() => setFormData(prev => ({ ...prev, fitnessGoal: goal.id }))} className={`p-4 rounded-xl border text-left transition-all ${formData.fitnessGoal === goal.id ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_15px_rgba(37,99,235,0.15)]' : 'border-[#1E293B] bg-[#0F172A] hover:border-gray-500'}`}>
              <div className={`font-semibold text-[14px] mb-1 ${formData.fitnessGoal === goal.id ? 'text-white' : 'text-gray-300'}`}>{goal.label}</div>
              <div className={`text-[12px] ${formData.fitnessGoal === goal.id ? 'text-[#2563EB]' : 'text-gray-500'}`}>{goal.desc}</div>
            </button>
          ))}
        </div>
        {errors.fitnessGoal && <p className="text-red-500 text-xs mt-2">{errors.fitnessGoal}</p>}
      </div>
      <div>
        <label className="block text-[14px] font-semibold text-gray-300 mb-3">Experience Level</label>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <button key={level.id} type="button" onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))} className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${formData.experienceLevel === level.id ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_15px_rgba(37,99,235,0.15)]' : 'border-[#1E293B] bg-[#0F172A] hover:border-gray-500'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.experienceLevel === level.id ? 'border-[#2563EB]' : 'border-gray-500'}`}>
                {formData.experienceLevel === level.id && <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />}
              </div>
              <div>
                <div className={`font-semibold text-[14px] ${formData.experienceLevel === level.id ? 'text-white' : 'text-gray-300'}`}>{level.label}</div>
                <div className={`text-[12px] mt-0.5 ${formData.experienceLevel === level.id ? 'text-[#2563EB]' : 'text-gray-500'}`}>{level.desc}</div>
              </div>
            </button>
          ))}
        </div>
        {errors.experienceLevel && <p className="text-red-500 text-xs mt-2">{errors.experienceLevel}</p>}
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      {!verified ? (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#111827] border border-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-[#2563EB]" />
            </div>
            <h3 className="text-[20px] font-bold text-white">Verify your email</h3>
            <p className="text-[14px] text-gray-400 mt-2">We sent a 6-digit code to <span className="font-semibold text-white">{formData.email}</span></p>
          </div>

          {!otpSent ? (
            <button onClick={handleSendOtp} className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Send OTP <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-gray-300 mb-2 text-center">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className={`w-full px-4 py-4 text-center text-[28px] font-bold tracking-[0.5em] rounded-xl border bg-[#0F172A] text-white placeholder-gray-600 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors ${otpError ? 'border-red-500' : 'border-[#1E293B]'}`} />
                {otpError && <p className="text-red-500 text-xs mt-2 text-center">{otpError}</p>}
              </div>
              <button onClick={handleVerifyOtp} className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-2">
                Verify Email
              </button>
              <div className="text-center mt-4">
                <button onClick={handleResendOtp} className="text-[14px] text-gray-400 hover:text-white transition-colors">Didn't receive it? <span className="text-[#2563EB] font-medium">Resend OTP</span></button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#111827] border border-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <h3 className="text-[24px] font-bold text-white mb-2">Email Verified!</h3>
          <p className="text-[15px] text-gray-400 mb-8">Your account is ready. Complete your registration.</p>
          <button onClick={() => setCurrentStep(5)} className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Complete Registration <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-10">
      <div className="w-20 h-20 bg-[#111827] border border-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <Dumbbell size={36} className="text-[#2563EB]" />
      </div>
      <h2 className="text-[28px] font-bold text-white mb-2">Welcome to FitForge!</h2>
      <p className="text-gray-400 text-[15px] mb-8">Your premium account has been created successfully.</p>
      <button className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
        Go to Dashboard
      </button>
      <p className="mt-6 text-[14px] text-gray-400">Already have an account? <button className="text-white font-medium hover:text-[#2563EB] transition-colors">Sign In</button></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] flex">
      {/* Left side banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0F1C] border-r border-[#1E293B] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2563EB] opacity-[0.05] blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400 opacity-[0.03] blur-[100px]"></div>
        </div>

        <div className="max-w-md relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#111827] border border-[#1E293B] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Dumbbell size={24} className="text-[#2563EB]" />
            </div>
            <span className="text-[24px] font-bold text-white tracking-tight">FitForge</span>
          </div>
          <h1 className="text-[48px] font-bold text-white leading-tight mb-6">Forge Your<br/>Best Self</h1>
          <p className="text-[18px] text-gray-400 leading-relaxed">Join the premium fitness coaching platform. Connect with elite trainers and achieve your goals with cinematic precision.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="lg:hidden flex items-center p-6 border-b border-[#1E293B] bg-[#030712]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111827] border border-[#1E293B] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.2)]">
              <Dumbbell size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-[20px] font-bold text-white tracking-tight">FitForge</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {currentStep < 4 && (
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-xl">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider rounded-lg mb-4">Client Registration</span>
                  <h2 className="text-[24px] font-bold text-white">
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
                  <div className="flex gap-4 mt-8">
                    {currentStep > 1 && <button type="button" onClick={handleBack} className="px-6 py-3 bg-[#0F172A] border border-[#1E293B] text-white font-semibold rounded-xl hover:border-gray-500 active:scale-[0.98] transition-all flex items-center gap-2"><ChevronLeft size={18} /> Back</button>}
                    {currentStep < 3 ? <button type="button" onClick={handleNext} className="flex-1 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">Continue <ArrowRight size={18} /></button> : <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-semibold rounded-xl hover:to-blue-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">Next <ArrowRight size={18} /></button>}
                  </div>
                </form>
              </div>
            )}
            
            {currentStep < 4 && (
              <div className="mt-8 pt-6 border-t border-[#1E293B]">
                <p className="text-[13px] text-gray-500 text-center mb-4 font-medium">Are you a professional trainer?</p>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#111827] border border-[#1E293B] text-gray-300 text-[13px] font-semibold rounded-xl hover:border-[#2563EB] hover:text-white transition-all">Trainer Sign Up</button>
                  <button className="flex-1 py-3 bg-[#111827] border border-[#1E293B] text-gray-300 text-[13px] font-semibold rounded-xl hover:border-[#2563EB] hover:text-white transition-all">Coach Login</button>
                </div>
              </div>
            )}

            {currentStep === 4 && <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-xl">{renderOtpStep()}</div>}
            {currentStep === 5 && <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-xl">{renderSuccess()}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage;