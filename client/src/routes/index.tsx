import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <header className="flex flex-row justify-around bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1>Rewards List</h1>
      </header>
      <main>
        <section className='flex justify-center'>
          <p>
            Edit <code>src/routes/index.tsx</code> and save to reload.
          </p>
        </section>
      </main>
    </div>
  );
}
