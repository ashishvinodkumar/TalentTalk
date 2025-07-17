import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Heart, Users, MessageCircle, Zap, CheckCircle, TrendingUp, DollarSign, Clock, ArrowRight, Sparkles, Target, Users2, Brain, Rocket } from "lucide-react";
import heroPurple from "../assets/hero-purple.jpg";

const Homepage = () => {
    const features = [
        {
            icon: <Brain className="h-8 w-8" />,
            title: "AI-Powered Matching",
            description: "Advanced machine learning algorithms analyze skills, experience, and cultural fit to create perfect matches.",
            highlight: "95% accuracy"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "LinkedIn Integration",
            description: "Seamlessly import and analyze LinkedIn profiles to extract comprehensive candidate insights.",
            highlight: "Instant import"
        },
        {
            icon: <MessageCircle className="h-8 w-8" />,
            title: "Conversational AI",
            description: "Chat interface extracts deeper insights about personality, motivation, and cultural alignment.",
            highlight: "Real-time analysis"
        },
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Express Interest",
            description: "Candidates express interest with one click, instantly notifying hiring managers of mutual matches.",
            highlight: "Instant notifications"
        }
    ];

    const hiringProblems = [
        {
            icon: <DollarSign className="h-6 w-6" />,
            title: "Expensive Recruiting Fees",
            description: "Companies spend 15-25% of annual salary on recruiting fees, draining budgets that could fuel growth and innovation.",
            stat: "25% of salary"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Lengthy Hiring Process",
            description: "Average time-to-hire is 6+ weeks, causing companies to lose top talent to faster competitors.",
            stat: "6+ weeks average"
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            title: "Poor Quality Matches",
            description: "67% of hires don't meet performance expectations, leading to costly turnover and endless re-hiring cycles.",
            stat: "67% failure rate"
        },
        {
            icon: <Target className="h-6 w-6" />,
            title: "Limited Candidate Pool",
            description: "Traditional methods only reach active job seekers, missing out on passive candidates who could be perfect fits.",
            stat: "30% reach only"
        }
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Candidates Create Profile",
            description: "Upload resume, connect LinkedIn, and chat with AI to build comprehensive profile highlighting skills and personality.",
            icon: <Users2 className="h-8 w-8" />
        },
        {
            step: "02",
            title: "AI Analyzes & Matches",
            description: "Advanced algorithms analyze candidate profiles against job requirements, considering skills, experience, and cultural fit.",
            icon: <Brain className="h-8 w-8" />
        },
        {
            step: "03",
            title: "Express Mutual Interest",
            description: "Candidates browse opportunities and express interest. Hiring managers see top matches with detailed AI insights.",
            icon: <Heart className="h-8 w-8" />
        },
        {
            step: "04",
            title: "Connect & Interview",
            description: "Direct connection between matched candidates and hiring managers, with all the context needed for successful interviews.",
            icon: <Rocket className="h-8 w-8" />
        }
    ];

    const companyImpacts = [
        { value: "80%", label: "Reduction in recruiting costs" },
        { value: "65%", label: "Faster time-to-hire" },
        { value: "3x", label: "Higher quality matches" },
        { value: "$50K+", label: "Average annual savings" }
    ];

    const candidateImpacts = [
        { value: "95%", label: "Profile match accuracy" },
        { value: "50%", label: "Faster job discovery" },
        { value: "4x", label: "More interview opportunities" },
        { value: "100%", label: "Free for candidates" }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Tech Recruiting Manager",
            company: "InnovateTech",
            content: "TalentTalk revolutionized our hiring process. We went from 6 weeks to 2 weeks average time-to-hire, and the quality of matches is incredible. The AI insights help us understand candidates beyond their resumes.",
            avatar: "SJ"
        },
        {
            name: "Michael Chen",
            role: "Software Engineer",
            company: "DataFlow Inc",
            content: "As a candidate, I love how TalentTalk understands my skills beyond just my resume. The AI matching found me the perfect role that aligned with my values and career goals. The process was seamless and personal.",
            avatar: "MC"
        },
        {
            name: "Emma Rodriguez",
            role: "HR Director",
            company: "ScaleUp Solutions",
            content: "We've saved over $50,000 in recruiting fees this year alone. The platform's ability to find quality candidates while reducing costs is game-changing. Our hiring success rate has never been higher.",
            avatar: "ER"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start mb-6">
                                <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 backdrop-blur">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    AI-Powered Talent Matching
                                </Badge>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                                Where Talent Speaks for{" "}
                                <span className="text-transparent bg-gradient-to-r from-primary-glow to-accent bg-clip-text">
                                    Itself
                                </span>
                            </h1>
                            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
                                Connect the right talent with the right opportunities using advanced AI. No expensive recruiters, no lengthy processes. Just intelligent matching that creates perfect career connections.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/candidate">
                                    <Button size="lg" className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:shadow-glow transition-all">
                                        <Users className="h-5 w-5 mr-2" />
                                        Start as Candidate
                                    </Button>
                                </Link>
                                <Link to="/hiring-manager">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur transition-all">
                                        <Rocket className="h-5 w-5 mr-2" />
                                        I'm Hiring
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start mt-8 space-x-6 text-primary-foreground/80">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                    <span>Free for candidates</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                    <span>No recruiting fees</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-accent/20 rounded-3xl blur-2xl"></div>
                            <img
                                src={heroPurple}
                                alt="AI-powered talent matching platform"
                                className="relative rounded-3xl shadow-2xl shadow-primary/30 hover:shadow-glow transition-all duration-500"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur rounded-xl p-4 shadow-purple border border-primary/20">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-primary">95% Match Success Rate</span>
                                </div>
                            </div>
                            <div className="absolute -top-6 -left-6 bg-background/90 backdrop-blur rounded-xl p-4 shadow-purple border border-primary/20">
                                <div className="flex items-center space-x-2">
                                    <Brain className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">AI-Powered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Problem Statement */}
            <section className="py-24 bg-gradient-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-destructive text-destructive-foreground">The Problem</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                            Why Traditional Hiring is Broken
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            The current hiring system is riddled with inefficiencies that hurt both companies and candidates. Here are the four major issues plaguing the industry.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {hiringProblems.map((problem, index) => (
                            <Card key={index} className="text-center hover:shadow-purple transition-all duration-300 border-0 bg-background/60 backdrop-blur">
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                        <div className="text-destructive">{problem.icon}</div>
                                    </div>
                                    <CardTitle className="text-destructive mb-2">{problem.title}</CardTitle>
                                    <Badge variant="destructive" className="text-sm">{problem.stat}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{problem.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI-Powered Solution */}
            <section className="py-24 bg-gradient-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary-foreground text-primary">AI-Powered Solution</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                            Intelligent Talent Matching
                        </h2>
                        <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                            Our advanced AI doesn't just match keywords – it understands context, culture, and career aspirations to create perfect matches.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-purple transition-all duration-300 bg-primary-foreground/10 backdrop-blur border-primary-foreground/20">
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4">
                                        <div className="text-primary-foreground">{feature.icon}</div>
                                    </div>
                                    <CardTitle className="text-primary-foreground mb-2">{feature.title}</CardTitle>
                                    <Badge className="bg-primary-foreground text-primary text-sm">{feature.highlight}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-primary-foreground/80">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">How It Works</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                            Simple, Intelligent Process
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Our four-step process makes hiring effortless for companies and empowering for candidates.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <Card key={index} className="text-center hover:shadow-card transition-all duration-300 group">
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <div className="text-primary">{step.icon}</div>
                                    </div>
                                    <div className="text-4xl font-bold text-primary mb-2">{step.step}</div>
                                    <CardTitle className="text-lg">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Real Impact - Companies & Candidates */}
            <section className="py-24 bg-gradient-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary-foreground text-primary">Real Impact</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                            Transforming Hiring for Everyone
                        </h2>
                        <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                            See the measurable impact TalentTalk creates for both companies and candidates.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Company Impact */}
                        <div>
                            <h3 className="text-2xl font-bold text-primary-foreground mb-8 text-center">For Companies</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {companyImpacts.map((impact, index) => (
                                    <Card key={index} className="text-center bg-primary-foreground/10 backdrop-blur border-primary-foreground/20">
                                        <CardContent className="pt-6">
                                            <div className="text-4xl font-bold text-primary-foreground mb-2">{impact.value}</div>
                                            <div className="text-primary-foreground/80">{impact.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Candidate Impact */}
                        <div>
                            <h3 className="text-2xl font-bold text-primary-foreground mb-8 text-center">For Candidates</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {candidateImpacts.map((impact, index) => (
                                    <Card key={index} className="text-center bg-primary-foreground/10 backdrop-blur border-primary-foreground/20">
                                        <CardContent className="pt-6">
                                            <div className="text-4xl font-bold text-primary-foreground mb-2">{impact.value}</div>
                                            <div className="text-primary-foreground/80">{impact.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">Testimonials</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what hiring managers and candidates are saying about TalentTalk.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-card transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                            <CardDescription>{testimonial.role} at {testimonial.company}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-primary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                        Ready to Transform Your Hiring?
                    </h2>
                    <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of companies and candidates who have already discovered the power of AI-driven talent matching.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/candidate">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                                Start as Candidate
                            </Button>
                        </Link>
                        <Link to="/hiring-manager">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Find Top Talent
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">TalentTalk</h3>
                            <p className="text-muted-foreground">
                                Where talent speaks for itself. Connecting the right people with the right opportunities.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Candidates</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link to="/candidate" className="hover:text-primary">Create Profile</Link></li>
                                <li><Link to="/candidate" className="hover:text-primary">Browse Jobs</Link></li>
                                <li>AI Matching</li>
                                <li>Career Tips</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Employers</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link to="/hiring-manager" className="hover:text-primary">Post Jobs</Link></li>
                                <li><Link to="/hiring-manager" className="hover:text-primary">Find Talent</Link></li>
                                <li>Pricing</li>
                                <li>Success Stories</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>About Us</li>
                                <li>Contact</li>
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                        <p>&copy; 2024 TalentTalk. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage; 