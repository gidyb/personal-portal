import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PortalContent from '@/Components/PortalContent';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth = null }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Personal Portal
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <PortalContent auth={auth} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
