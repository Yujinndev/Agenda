interface Tabs {
  title: string
}

const Tabs = ({ tabs }: { tabs: Tabs[] }) => {
  return (
    <div>
      {tabs.map((tab) => (
        <li>{tab.title}</li>
      ))}
    </div>
  )
}

export default Tabs
