
"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, UserProfile } from '@/services/campus-data';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  Check, 
  ArrowRight, 
  Calculator,
  Globe,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Receipt,
  Lock,
  Zap,
  Banknote,
  Wallet
} from 'lucide-react';

const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  XOF: 615, // CFA Franc
  RWF: 1315,
  KES: 130,
  UGX: 3750,
  TZS: 2600,
};

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'XOF', symbol: 'FCFA', name: 'CFA Franc' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' }
];

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    processingTime: 'Instant',
    fees: '2.9% + $0.30'
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: Smartphone,
    description: 'MTN, Airtel, Tigo Cash',
    processingTime: '2-5 minutes',
    fees: '1.5%'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct transfer from your bank',
    processingTime: '1-3 business days',
    fees: 'Free'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: Banknote,
    description: 'Bitcoin, Ethereum, USDC',
    processingTime: '10-30 minutes',
    fees: '1%'
  }
];

const TuitionPaymentPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState(2500);
  const [convertedAmount, setConvertedAmount] = useState(2500);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    semester: 'Fall 2024',
    paymentType: 'full'
  });
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [mobileMoneyData, setMobileMoneyData] = useState({
    provider: 'mtn',
    phoneNumber: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
          if (userProfile) {
            setFormData(prev => ({
              ...prev,
              studentId: userProfile.studentId,
              fullName: userProfile.displayName,
              email: userProfile.email,
              phone: userProfile.phone
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else if (!authLoading) {
        setIsLoading(false);
    }
  }, [user, authLoading]);

  // Real-time currency conversion
  useEffect(() => {
    const rate = exchangeRates[selectedCurrency] || 1;
    setConvertedAmount(Math.round(amount * rate * 100) / 100);
  }, [selectedCurrency, amount]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: keyof typeof cardData, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const processPayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    setStep(4); // Success step
  };

  const getCurrencySymbol = () => {
    return currencies.find(c => c.code === selectedCurrency)?.symbol || '$';
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
          <header className="mb-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-4 w-1/2 mt-2" />
          </header>
            <div className="space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-56 w-full" />
          </div>
      </div>
    )
  }
  
  if (!profile) {
      return (
         <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 text-center">
            <h1 className="text-2xl font-bold">No Payment Data Found</h1>
            <p className="text-muted-foreground">We couldn't find any payment records for your account.</p>
        </div>
      )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-headline">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment of {getCurrencySymbol()}{convertedAmount.toLocaleString()} has been processed successfully.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Transaction Number</span>
                <span className="font-mono text-sm">TXN-{Date.now()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Method</span>
                <span>{selectedPaymentMethod?.name}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Receipt className="w-5 h-5 inline mr-2" />
                Download Receipt
              </button>
              <button 
                onClick={() => {
                  setStep(1);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                New Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-headline">EduPay</h1>
                <p className="text-sm text-gray-500">Secure Tuition Fee Payment</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>SSL Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              
              {/* Progress bar */}
              <div className="bg-gray-50 px-8 py-6">
                <div className="w-full">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Information</span>
                      <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Payment</span>
                      <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Confirmation</span>
                    </div>
                    <div className="relative pt-4">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${((step - 1) / 2) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>
              </div>


              <div className="p-8">
                {/* Step 1: Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-headline">Student Information</h2>
                      <p className="text-gray-600">Please fill in your information to continue</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Student ID
                        </label>
                        <input
                          type="text"
                          value={formData.studentId}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+241 077 12 34 56"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Semester
                        </label>
                        <select
                          value={formData.semester}
                          onChange={(e) => handleInputChange('semester', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="Fall 2024">Fall 2024</option>
                          <option value="Spring 2025">Spring 2025</option>
                          <option value="Summer 2025">Summer 2025</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Calculator className="w-4 h-4 inline mr-2" />
                          Payment Type
                        </label>
                        <select
                          value={formData.paymentType}
                          onChange={(e) => {
                            handleInputChange('paymentType', e.target.value);
                            setAmount(e.target.value === 'full' ? 2500 : e.target.value === 'partial' ? 1250 : 500);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="full">Full Payment - $2,500</option>
                          <option value="partial">Partial Payment - $1,250</option>
                          <option value="installment">Installment - $500</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.studentId || !formData.fullName || !formData.email}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-headline">Payment Method</h2>
                      <p className="text-gray-600">Choose your preferred payment method</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedMethod === method.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'}`} />
                              {selectedMethod === method.id && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white"/></div>}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span><Clock className="w-3 h-3 inline mr-1" />{method.processingTime}</span>
                              <span>Fees: {method.fees}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selectedMethod === 'card' && (
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Card Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => handleCardChange('number', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) => handleCardChange('expiry', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="text"
                              value={cardData.cvv}
                              onChange={(e) => handleCardChange('cvv', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => handleCardChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="Jean Dupont"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'mobile_money' && (
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Mobile Money</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                          <select
                            value={mobileMoneyData.provider}
                            onChange={(e) => setMobileMoneyData(prev => ({ ...prev, provider: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="airtel">Airtel Money</option>
                            <option value="tigo">Tigo Cash</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={mobileMoneyData.phoneNumber}
                            onChange={(e) => setMobileMoneyData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="+241 77 12 34 56"
                          />
                        </div>
                      </div>
                    )}
                    
                     {selectedMethod === 'bank_transfer' && (
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Instructions</h3>
                        <p className="text-sm text-gray-600">Please make the transfer to the following details using your student ID as a reference.</p>
                        <div className="text-sm">
                            <p><strong>Bank:</strong> Banque Internationale pour le Commerce et l'Industrie du Gabon (BICIG)</p>
                            <p><strong>Beneficiary:</strong> Université Omar Bongo</p>
                            <p><strong>IBAN:</strong> GA27 1234 5678 9012 3456 7890 123</p>
                            <p><strong>Reference:</strong> {formData.studentId || "Your Student ID"}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedMethod === 'crypto' && (
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4 text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">Pay with Crypto</h3>
                        <p className="text-sm text-gray-600 mb-4">Scan the QR code to pay the equivalent of ${amount} in USDC (ERC-20).</p>
                        <div className="flex justify-center">
                            <img src="https://placehold.co/150x150.png" alt="QR Code" data-ai-hint="QR code" />
                        </div>
                         <p className="text-xs text-muted-foreground mt-2 break-all">0x1234...abcd</p>
                      </div>
                    )}


                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        Review Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-headline">Confirm Payment</h2>
                      <p className="text-gray-600">Please check your information before finalizing</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Student</span>
                        <span className="font-semibold">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ID Number</span>
                        <span className="font-semibold">{formData.studentId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Semester</span>
                        <span className="font-semibold">{formData.semester}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold">{selectedPaymentMethod?.name}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-blue-600">{getCurrencySymbol()}{convertedAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-1 shrink-0" />
                        <p className="text-sm text-yellow-800">
                          By clicking "Finalize Payment", you agree to our terms of service and authorize the charge.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(2)}
                        disabled={processing}
                        className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={processPayment}
                        disabled={processing}
                        className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Finalize Payment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Currency Converter</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {getCurrencySymbol()}{convertedAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rate: 1 USD ≈ {exchangeRates[selectedCurrency] || 1} {selectedCurrency}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Secure Payment</h3>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  PCI DSS Compliant
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  256-bit SSL Encryption
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  Fraud Protection
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                    Can I pay in installments?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    Yes, you can choose the partial payment or installment option in the form.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                    Are the payments secure?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    Absolutely. We use SSL encryption and are PCI DSS compliant.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionPaymentPage;
