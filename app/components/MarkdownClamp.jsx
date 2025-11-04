import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";

const MarkdownClamp = ({ content }) => {
  return (
    <div className="text-[#313131] mb-3 font-medium font-sawarabi clamp-6">
      <ReactMarkdown
        components={{
          h1: (props) => <span {...props} />,
          h2: (props) => <span {...props} />,
          p:  (props) => <span {...props} />,
          img: () => null, // চাইলে ইমেজ বাদ দিতে পারো
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownClamp.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownClamp;
