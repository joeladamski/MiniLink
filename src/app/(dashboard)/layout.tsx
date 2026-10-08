import { redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs";
import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard/dashboard-nav';
import { SiteFooter } from '@/components/site-footer';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME || 'BioLync Pro mini'} | Dashboard`,
    };
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <DashboardNav
                isPlatformOwner={Boolean(process.env.PLATFORM_OWNER_CLERK_USER_ID && user.id === process.env.PLATFORM_OWNER_CLERK_USER_ID)}
                user={{
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.emailAddresses[0]?.emailAddress,
                    username: user.username,
                    image: user.imageUrl,
                }}
            />
            <main className="pt-16 flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
