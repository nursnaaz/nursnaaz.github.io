import Alert from '@cloudscape-design/components/alert'


export function StudentNote({ children, title = "Key Insight" }) {
  return (
    <Alert
      type="info"
      header={`💡 ${title}`}
    >
      {children}
    </Alert>
  )
}




