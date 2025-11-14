import Table from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'


export function DataTable({ columns, items, header }) {
  return (
    <Table
      columnDefinitions={columns}
      items={items}
      header={header && <Box variant="h3">{header}</Box>}
      variant="embedded"
    />
  )
}
