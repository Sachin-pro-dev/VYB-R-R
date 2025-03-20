
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useVybiumToken } from '@/hooks/useVybiumToken';

const transferSchema = z.object({
  recipientAddress: z.string()
    .min(42, 'Ethereum address must be 42 characters')
    .max(42, 'Ethereum address must be 42 characters')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
  amount: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
});

type TransferFormValues = z.infer<typeof transferSchema>;

const VybiumTransferForm: React.FC = () => {
  const { balance, isLoading, transferTokens } = useVybiumToken();
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientAddress: '',
      amount: '',
    },
  });

  const onSubmit = async (values: TransferFormValues) => {
    const success = await transferTokens(values.recipientAddress, values.amount);
    if (success) {
      form.reset();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
          alt="VYBium Token" 
          className="w-12 h-12 hover:rotate-12 transition-transform duration-300" 
        />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="recipientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x..."
                    className="glass-input"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the Ethereum address to send VYBium tokens to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="0.0"
                      className="glass-input pr-12"
                      {...field}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm font-orbitron text-gray-400">VYB</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>Amount of VYBium to send</span>
                  <span>Balance: {Number(balance).toFixed(4)} VYB</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Send VYBium'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VybiumTransferForm;
