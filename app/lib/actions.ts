'use server'

import { z } from 'zod'
import postgres from 'postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
    id: z.string({}),
    customerId: z.string({
        required_error: 'Customer ID is required',
    }),
    amount: z.string({
        required_error: 'Amount is required',
    }).min(1, 'Amount must be greater than 0'),
    status: z.string({
        required_error: 'Status is required',
    }),
    data: z.string(),
})
const CreateInvoice = FormSchema.omit({
    id: true,
    data: true
})

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'})

export type State = {
    errors?: {
        customerId?: string[]
        amount?: string[]
        status?: string[]
    }
    message?: string | null
}

export async function createInvoice(prevState: State, formData: FormData) {

    const validationFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    if (!validationFields.success) {
        return {
            errors: validationFields.error.flatten(),
        }
    }

    const {customerId, amount, status} = validationFields.data
    const amountInCents = Number(amount) * 100
    const date = new Date().toISOString().split('T')[0]

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
    } catch (error) {
        console.log(error)
        return {
            message: 'Failed to create invoice',
        }
    }
    

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, prevState: State,  formData: FormData) {
    const validationFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    if (!validationFields.success) {
        return {
            errors: validationFields.error.flatten(),
        }
    }

    const {customerId, amount, status} = validationFields.data
    const amountInCents = Number(amount) * 100
    const date = new Date().toISOString().split('T')[0]


    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId},
    amount = ${amountInCents},
    status = ${status},
    date = ${date}
    WHERE id = ${id}
    `
    } catch (error) {
        console.log(error)
        return {
            message: 'Failed to update invoice',
        }
    }

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string, prevState: State) {
    try {
       await sql`
    DELETE FROM invoices
    WHERE id = ${id}
    ` 
    } catch (error) {
        console.log(error)
        return {
            message: 'Failed to delete invoice',
        }
    }
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}