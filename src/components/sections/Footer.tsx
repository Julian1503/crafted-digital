import Link from "next/link";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="bg-background py-12 border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/">
                            <p className="text-2xl font-serif font-bold tracking-tight">
                                Julian Delgado<span className="text-secondary">_</span>
                            </p>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Premium software services for ambitious brands.
                        </p>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/#services" className="hover:text-foreground transition-colors">Services</Link>
                        <Link href="/#work" className="hover:text-foreground transition-colors">Work</Link>
                        <Link href="/about-me" className="hover:text-foreground transition-colors">About</Link>
                        <Link href="/#process" className="hover:text-foreground transition-colors">Process</Link>
                        <Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>

                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                            <FaTwitter size={20} />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                            <FaLinkedin size={20} />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                            <FaInstagram size={20} />
                        </Link>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Crafted Digital. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
