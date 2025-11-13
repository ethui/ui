import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { isAddress } from "viem";
import { z } from "zod";

export const msgSenderSchema = z.object({
  msgSender: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return isAddress(val);
      },
      { message: "Invalid address format" },
    )
    .optional(),
});

export type MsgSenderFormData = z.infer<typeof msgSenderSchema>;

export function useMsgSenderForm(defaultSender?: Address) {
  const form = useForm<MsgSenderFormData>({
    mode: "onChange",
    resolver: zodResolver(msgSenderSchema),
    defaultValues: {
      msgSender: defaultSender || "",
    },
  });

  const msgSenderValue = form.watch("msgSender");
  const msgSender: Address | undefined = msgSenderValue
    ? (msgSenderValue as Address)
    : undefined;

  return {
    form,
    msgSender,
  };
}
