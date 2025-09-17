import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownClamp = ({ content }) => {
  return (
    <div className="text-[#313131] mb-3 font-medium font-sawarabi clamp-6">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <span {...props} />,
          h2: ({node, ...props}) => <span {...props} />,
          p:  ({node, ...props}) => <span {...props} />,
          img: () => null, // চাইলে ইমেজ বাদ দিতে পারো
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownClamp;
