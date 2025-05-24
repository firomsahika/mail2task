

import prisma from "@/lib/db";

export async function createTaskFromEmail(subject:string,fromEmail:string,body:string, createdAt:Date
){
  const task = await prisma.task.create({
    data:{
        subject,
         body,
         fromEmail, 
         createdAt
    }
  });

  return task;
}


export async function getTasks() {
    return await prisma.task.findMany({
        orderBy:{
            createdAt:'desc',
        }
    })
}