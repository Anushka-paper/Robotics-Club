

export default function Example() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Контейнер с колонкой */}
      <div className="flex flex-col items-center w-full">
        {/* Заголовок сверху */}
        <h1 className="text-3xl font-semibold text-white">Latest Blog</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-lg text-center">
          Stay ahead of the curve with fresh content on code, design, startups, and everything in between.
        </p>

        {/* Карточки */}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://cdn.21st.dev/assets/mirror/6f/6f1c926bae8d6e71a611ff4516129defb81169307e6ed04bb285252af9a35082.jpg"
              alt=""
            />
            <h3 className="text-base text-slate-200 font-medium mt-3">
              Color Psychology in UI: How to Choose the Right Palette
            </h3>
            <p className="text-xs text-indigo-400 font-medium mt-1">UI/UX design</p>
          </div>

          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://cdn.21st.dev/assets/mirror/53/532743c99df6086cd352dddd6c4123c731174ce078fbf8aa6b95d66a239ffb9b.jpg"
              alt=""
            />
            <h3 className="text-base text-slate-200 font-medium mt-3">
              Understanding Typography: Crafting a Visual Voice for Your Brand
            </h3>
            <p className="text-xs text-indigo-400 font-medium mt-1">Branding</p>
          </div>

          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://cdn.21st.dev/assets/mirror/6c/6cfc99c18d9a71ed731d82d84406a209b30f7fa76f3e5b7ecdfa48efbd62f613.jpg"
              alt=""
            />
            <h3 className="text-base text-slate-200 font-medium mt-3">
              Design Thinking in Practice: How to Solve Real User Problems
            </h3>
            <p className="text-xs text-indigo-400 font-medium mt-1">Product Design</p>
          </div>
        </div>
      </div>
    </>
  );
}
