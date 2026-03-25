function tokenizeCode(code) {
  const pattern =
    /("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(?:await|const|return|new)\b|\b(?:page|cy|browser)\b|\b(?:frameLocator|locator|getByTestId|get|find|shadow|switchToFrame|setValue|click|fill|type)\b)/g;

  return code.split(pattern).filter(Boolean).map((token) => {
    if (/^"(?:\\.|[^"])*"$|^'(?:\\.|[^'])*'$/.test(token)) {
      return { type: "string", value: token };
    }

    if (/^(await|const|return|new)$/.test(token)) {
      return { type: "keyword", value: token };
    }

    if (/^(page|cy|browser)$/.test(token)) {
      return { type: "object", value: token };
    }

    if (
      /^(frameLocator|locator|getByTestId|get|find|shadow|switchToFrame|setValue|click|fill|type)$/.test(
        token
      )
    ) {
      return { type: "method", value: token };
    }

    return { type: "plain", value: token };
  });
}

function HighlightedCodeBlock({ code, testId }) {
  const lines = code.split("\n");

  return (
    <pre className="automation-guide-code" data-testid={testId}>
      <code>
        {lines.map((line, lineIndex) => (
          <div className="automation-guide-code__line" key={`${line}-${lineIndex}`}>
            {tokenizeCode(line).map((token, tokenIndex) => (
              <span
                key={`${token.value}-${tokenIndex}`}
                className={`automation-guide-token automation-guide-token--${token.type}`}
              >
                {token.value}
              </span>
            ))}
          </div>
        ))}
      </code>
    </pre>
  );
}

export default HighlightedCodeBlock;
