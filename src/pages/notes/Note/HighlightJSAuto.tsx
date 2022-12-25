import { useMemo } from "react";
import hljs from "highlight.js";


type Props = {
  content: string,
}

const HighlightJSAuto = ({ content }: Props) => {
  const highlighted = useMemo(() => (hljs.highlightAuto(content)), [content]);

  return (
    <pre className="hljs">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted.value }} />
    </pre>
  );
};

export default HighlightJSAuto;
