import { getTasks } from '@/services/taskService'
import React from 'react'

interface TaskType{
  id: string;
  subject: string;
  fromEmail: string;
  body: string;
}

export default async function HomePage(){
  const tasks = await getTasks();

  console.log("Tasks", tasks)

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
          📬 Mail2Task
        </h1>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">
            No tasks yet. Send an email to your Postmark address to get started!
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {task.subject}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  From: {task.fromEmail}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{task.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
