import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  "Instant messaging",
  "Real-time notifications",
  "Secure conversations",
];

const Welcome = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.24),_transparent_40%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-4 py-2 sm:text-sm text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Fresh conversations, beautifully connected
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-blue-600">BlueChat</span>
            </h1>

            <p className="mt-6 sm:text-lg text-sm leading-6 sm:leading-8 text-slate-600 ">
              A modern, lightning-fast chat experience designed for effortless
              connections, smooth collaboration, and joyful everyday
              conversations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-blue-200 bg-white/80 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 -translate-y-3 rounded-[2rem] bg-blue-500/20 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/85 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-100">
                      Live chat preview
                    </p>
                    <h2 className="mt-1 text-xl font-bold">Team Circle</h2>
                  </div>
                  <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                    Online
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-lg font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold">Ava</p>
                      <p className="text-sm text-blue-100">
                        Hello team! Ready to launch?
                      </p>
                    </div>
                  </div>

                  <div className="ml-10 rounded-2xl bg-white/20 p-3 text-sm text-blue-50">
                    I’m excited to see the new flow in action.
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-lg font-bold">
                      J
                    </div>
                    <div>
                      <p className="font-semibold">Jordan</p>
                      <p className="text-sm text-blue-100">
                        Perfect timing — the experience feels smooth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-blue-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Why users love it
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Fast, beautiful, and built for modern teams.
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    4.9/5
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
