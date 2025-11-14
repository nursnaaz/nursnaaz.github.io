import Alert from '@cloudscape-design/components/alert'


export function TryYourself({ children }) {
  return (
    <Alert
      type="warning"
      header="🎯 Try It Yourself"
    >
      {children}
    </Alert>
  )
}
