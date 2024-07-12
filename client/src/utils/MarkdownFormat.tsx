import { Dot } from 'lucide-react'

const MarkdownFormat = ({ details }: { details: string }) => {
  const splitedWords = details.split('/')

  return splitedWords.map((segment: string, index: number) => (
    <div key={index}>
      {segment.includes('*') ? (
        <ul>
          {segment.split('*').map((part: string, i: number) => {
            const trimmedPart = part.trim()
            if (trimmedPart) {
              return trimmedPart.includes('-t') ? (
                trimmedPart.split('-t').map(
                  (subPart: string, j: number) =>
                    subPart.trim() && (
                      <li key={j} className="ps-12 flex gap-4 items-center">
                        <Dot color="red" />
                        {subPart.trim()}
                      </li>
                    )
                )
              ) : (
                <li key={i} className="ps-4 flex gap-4 items-center">
                  <Dot size={30} />
                  {trimmedPart}
                </li>
              )
            }
            return null
          })}
        </ul>
      ) : (
        <p key={index}>{segment.trim()}</p>
      )}
    </div>
  ))
}

export default MarkdownFormat
