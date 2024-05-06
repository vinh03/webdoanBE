export const TruncatedText = ({ text, limit }) => {
  const truncated = text.slice(0, limit);
  return (
    <div>
      {truncated}
      {text.length > limit && "..."}
    </div>
  );
};
