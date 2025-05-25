import { PrismaClient } from '@prisma/client';
import { getTasks } from '@/services/taskService';

const prisma = new PrismaClient();

export default async function Home() {

  const tasks = await getTasks();
  

  return (
    <main className="min-h-screen bg-slate-800 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Email Tasks
          </h1>
          <div className="text-sm text-gray-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📬</div>
            <p className="text-gray-400 text-lg">
              No tasks yet. Send an email to your Postmark address to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-300">
                    {task.subject}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-400">From: </span>
                  <span className="text-sm text-purple-300">{task.fromEmail}</span>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{task.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
