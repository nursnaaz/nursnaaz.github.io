import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'


export function CodeBlock({ children, code, language = "python", title }) {
  const codeContent = code || children
  
  return (
    <Container
      header={title ? <Header variant="h3">{title}</Header> : undefined}
    >
      <pre style={{
        background: '#2c3e50',
        color: '#ecf0f1',
        padding: '20px',
        borderRadius: '8px',
        overflow: 'auto',
        fontFamily: 'Monaco, Menlo, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}>
        <code>{codeContent}</code>
      </pre>
    </Container>
  )
}
