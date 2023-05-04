export default function News({ article }) {
  // console.log(article);
  return (
    <a rel="noreferrer" href={article.url} target="_blank">
      <div className="flex items-center justify-between px-4 py-2 space-x-2 hover:bg-gray-200 transition duration-500 ease-out">
        <div className="space-y-0.5">
          <h6 className="text-sm font-bold ">{article.title}</h6>
        </div>
        <img
          className="rounded-xl"
          width="70"
          src={article.urlToImage}
          alt="article image"
        />
      </div>
    </a>
  );
}
