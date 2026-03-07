
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-slate-400">Last updated: March 08, 2026</p>
                </div>

                <div className="text-center mb-12">
                  <Link to="/" className="inline-flex items-center gap-2 rounded-md bg-slate-800/80 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors duration-300">
                    <ArrowLeft size={16} />
                    Back to Home
                  </Link>
                </div>

                <div className="space-y-8 text-lg font-light leading-relaxed">
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Introduction</h2>
                        <p>This Privacy Policy describes how Shahad Uddin ("I", "me", or "my") collects, uses, and discloses your information in connection with your use of my website, shahaduddin.com (the "Website").</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Information I Collect</h2>
                        <p>I may collect the following types of information:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
                            <li><strong className="text-slate-200">Personal Information:</strong> I may collect personal information that you voluntarily provide to me, such as your name and email address when you contact me through the contact form.</li>
                            <li><strong className="text-slate-200">Usage Data:</strong> I may automatically collect certain information about your device and how you interact with my Website. This may include your IP address, browser type, operating system, and other usage details.</li>
                        </ul>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">3. How I Use Your Information</h2>
                        <p>I use the information I collect for various purposes, including:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
                            <li>To provide, operate, and maintain my Website.</li>
                            <li>To improve, personalize, and expand my Website.</li>
                            <li>To understand and analyze how you use my Website.</li>
                            <li>To respond to your comments, questions, and requests.</li>
                        </ul>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">4. Cookies and Tracking</h2>
                        <p>My Website does not use cookies or any third-party tracking technologies for advertising or analytics purposes. I am committed to providing a private, ad-free, and tracker-free browsing experience.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Data Security</h2>
                        <p>I take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no electronic transmission or storage is 100% secure.</p>
                    </div>

                     <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Contact Me</h2>
                        <p>If you have any questions about this Privacy Policy, please contact me at: <a href="mailto:contact@shahaduddin.com" className="text-blue-400 hover:underline">contact@shahaduddin.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
