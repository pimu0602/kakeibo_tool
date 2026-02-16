import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/types';

export async function GET() {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const expense: Expense = await request.json();
    const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id === 'all') {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .neq('id', 'placeholder'); // Delete all by non-matching condition or just .delete() if permitted

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (id) {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch updated list
    const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    return NextResponse.json(data);
}
