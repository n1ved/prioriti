import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import './bg.css'

const Home = () => {
  return (
      <div className={'animate'}>
      <section className="container mt-10 flex flex-col items-center gap-3 text-center md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2">
        <h1 className="mb-1 font-mono text-6xl font-extrabold leading-tight tracking-tighter md:text-4xl text-white">
          prioriti
        </h1>
        <p className="text-gray-50 max-w-2xl">
          A simple AI based study plan generator that adapts to your needs
        </p>
        <div className="mt-1">

        </div>
        <div className="mt-2 flex gap-4">
          <Button variant='outline' asChild>
            <a
                href="/setup/"
                target="_blank"

            >
              Get Started
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/n1ved/prioriti" target="_blank" className="bg-transparent text-white">
              <Icons.github className="mr-2 size-4" /> GitHub
            </a>
          </Button>
        </div>
      </section>
      </div>
  );
};

export default Home;