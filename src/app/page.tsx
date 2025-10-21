import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button> Get Started </Button>
    </div>
  );
}
