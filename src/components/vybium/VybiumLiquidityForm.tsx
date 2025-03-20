
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BarChart } from 'lucide-react';
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

const liquiditySchema = z.object({
  tokenAmount: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Token amount must be a positive number',
    }),
  stablecoinAmount: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Stablecoin amount must be a positive number',
    }),
});

type LiquidityFormValues = z.infer<typeof liquiditySchema>;

const VybiumLiquidityForm: React.FC = () => {
  const { balance, isLoading, addLiquidity } = useVybiumToken();
  
  const form = useForm<LiquidityFormValues>({
    resolver: zodResolver(liquiditySchema),
    defaultValues: {
      tokenAmount: '',
      stablecoinAmount: '',
    },
  });

  const onSubmit = async (values: LiquidityFormValues) => {
    const success = await addLiquidity(values.tokenAmount, values.stablecoinAmount);
    if (success) {
      form.reset();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <img 
            src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
            alt="VYBium Token" 
            className="w-12 h-12 hover:rotate-12 transition-transform duration-300" 
          />
          <div className="absolute -right-4 -bottom-1 bg-green-500 rounded-full p-1">
            <BarChart className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="glass rounded-lg p-3 mb-6 text-center text-sm">
        <p className="text-gray-300">
          Add liquidity to earn trading fees and boost your staking rewards
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tokenAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VYBium Amount</FormLabel>
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
                  <span>Amount of VYBium to add</span>
                  <span>Balance: {Number(balance).toFixed(4)} VYB</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stablecoinAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stablecoin Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="0.0"
                      className="glass-input pr-12"
                      {...field}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm font-orbitron text-gray-400">USDC</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Amount of stablecoin to pair with VYBium
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Add Liquidity'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VybiumLiquidityForm;
