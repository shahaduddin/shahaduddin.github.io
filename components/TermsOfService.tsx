
import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Terms of Service</h1>
                    <p className="mt-4 text-lg text-slate-400">Last updated: October 26, 2023</p>
                </div>

                <div className="space-y-8 text-lg font-light leading-relaxed">
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using shahaduddin.com (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Website.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Use of the Website</h2>
                        <p>You agree to use the Website only for lawful purposes. You are prohibited from using the Website in any way that could damage, disable, or impair the Website or interfere with any other party's use of the Website.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">3. Intellectual Property</h2>
                        <p>All content on this Website, including text, graphics, and code, is the property of Shahad Uddin and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without my express written permission.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">4. Disclaimer of Warranties</h2>
                        <p>The Website is provided "as is" without any warranties of any kind. I do not warrant that the Website will be error-free or that access to it will be continuous or uninterrupted.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Limitation of Liability</h2>
                        <p>In no event shall I be liable for any direct, indirect, or consequential damages arising out of your use of the Website.</p>
                    </div>

                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Contact Me</h2>
                        <p>If you have any questions about these Terms, please contact me at: <a href="mailto:contact@shahaduddin.com" className="text-blue-400 hover:underline">contact@shahaduddin.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
