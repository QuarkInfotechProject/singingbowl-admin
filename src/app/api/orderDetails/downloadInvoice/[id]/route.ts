import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ParamT {
    params: {
        id: string;
    };
}
export async function GET(request: Request, { params }: ParamT) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    try {
        const res = await fetch(`${process.env.BASE_URL}/orders/download-invoice/${params.id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/pdf',
            },
        });

        if (res.status !== 200) {
            const errorData = await res.json().catch(() => ({ message: 'Download failed' }));
            return NextResponse.json(errorData, { status: res.status });
        }

        // Forward the file content
        const blob = await res.blob();
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="invoice-${params.id}.pdf"`);

        return new NextResponse(blob, { status: 200, statusText: "OK", headers });

    } catch (error) {
        return NextResponse.json({ message: `${error}` }, { status: 500 });
    }
}
