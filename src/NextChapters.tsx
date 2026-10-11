import { useState } from 'react'

type Cash = 'none' | 'partial' | 'all'

type Stage =
    | 'breakfast'
    | 'envelope'
    | 'interview'
    | 'missed'
    | 'event'
    | 'overstay'
    | 'elevator'
    | 'alexander'
    | 'ending'

type Decision = {
  title: string
  detail: string
  honesty?: number
  base?: number
  plus?: string
  minus?: string
  cash?: Cash
}

type Log = {
  scene: string
  action: string
  honesty: number
  favor: number
  note: string
}

const order: Stage[] = [
  'breakfast',
  'envelope',
  'interview',
  'missed',
  'event',
  'overstay',
  'elevator',
  'alexander',
  'ending',
]

const next = (stage: Stage): Stage =>
    order[order.indexOf(stage) + 1] ?? 'ending'

const debt = 4860

const cashAmount = (cash: Cash): number => {
  if (cash === 'all') return 8000
  if (cash === 'partial') return debt
  return 0
}
export default function NextChapters({
                                       mbti = 'INTP',
                                       onRestart,
                                     }: {
  mbti?: string
  onRestart?: () => void
}) {
  const [stage, setStage] = useState<Stage>('breakfast')
  const [honesty, setHonesty] = useState(0)
  const [favor, setFavor] = useState(0)
  const [cash, setCash] = useState<Cash>('none')
  const [reportedEnvelope, setReportedEnvelope] = useState(false)
  const [log, setLog] = useState<Log[]>([])
  const [answer, setAnswer] = useState<string | null>(null)
  const [debtPaid, setDebtPaid] = useState(false)

  const impressed = favor >= 4
  const betterJob = impressed && honesty >= 4

  const personality = /^[EI][NS][TF][JP]$/.test(mbti)
      ? mbti
      : 'INTP'

  const choose = (choice: Decision) => {
    let modifier = 0

    if (choice.plus && personality.includes(choice.plus)) {
      modifier += 1
    }

    if (choice.minus && personality.includes(choice.minus)) {
      modifier -= 1
    }

    const earned =
        choice.base === undefined
            ? 0
            : Math.max(0, choice.base + modifier)

    const honestyEarned = choice.honesty ?? 0

    if (honestyEarned > 0) {
      setHonesty(previous => previous + honestyEarned)
    }

    if (earned > 0) {
      setFavor(previous => previous + earned)
    }

    if (choice.cash !== undefined) {
      setCash(choice.cash)
    }

    if (
        (stage === 'envelope' || stage === 'missed') &&
        honestyEarned > 0
    ) {
      setReportedEnvelope(true)
    }

    const mbtiNote =
        choice.base === undefined
            ? 'No executive score'
            : `Base ${choice.base}; MBTI ${modifier >= 0 ? '+' : ''}${modifier}; earned ${earned}`

    setLog(previous => [
      ...previous,
      {
        scene: stage,
        action: choice.title,
        honesty: honestyEarned,
        favor: earned,
        note: mbtiNote,
      },
    ])

    setAnswer(choice.detail)
  }

  const advance = () => {
    if (stage === 'event') {
      setDebtPaid(true)
    }

    setAnswer(null)
    setStage(next(stage))
  }

  const options = (choices: Decision[]) =>
      answer !== null ? (
          <>
            <p className="alex-reaction">{answer}</p>

            <button
                className="primary-button"
                onClick={advance}
            >
              Continue →
            </button>
          </>
      ) : (
          <>
            <p className="chapter-end">WHAT DO YOU DO?</p>

            <div
                className="reception-options"
                style={{ display: 'grid', gap: 10 }}
            >
              {choices.map((choice, index) => (
                  <button
                      key={index}
                      className="primary-button"
                      onClick={() => choose(choice)}
                  >
                    {choice.title}
                  </button>
              ))}
            </div>
          </>
      )

  const heading = (time: string, title: string) => (
      <>
        <p className="time">{time}</p>
        <h1>{title}</h1>
      </>
  )

  let endingTitle = ''
  let endingText = ''

  const honestyJobExplanation =
      betterJob
          ? 'Alexander also mentions your repeated warnings to the hotel. ' +
          'You were willing to speak up when something was wrong, even when ' +
          'nobody listened. That earns you a substantially better position.'
          : ''

  if (cash === 'partial') {
    if (impressed) {
      endingTitle = 'A Private Arrangement'

      endingText =
          'The missing $4,860 is noticed immediately. ' +
          'Alexander knows the envelope was opened, and the exact shortfall ' +
          'makes your explanation difficult to believe. ' +
          'But his executives are unusually enthusiastic about you. ' +
          'Rather than involve the police, he offers to resolve the matter privately. ' +
          'Your debt is paid, and he offers you a job. ' +
          honestyJobExplanation +
          ' You accept before anyone can reconsider.'
    } else {
      endingTitle = 'An Expensive Investigation'

      endingText =
          'The envelope is still there, but $4,860 is missing. ' +
          'That is a remarkably specific amount to have vanished. ' +
          'The hotel reviews access records, staff statements, and your movements. ' +
          'With no influential executive eager to defend you, the investigation escalates. ' +
          'You paid your debt, but now you face criminal charges and the possibility of jail. ' +
          'An impressively poor exchange.'
    }
  } else if (cash === 'all') {
    if (impressed) {
      endingTitle = 'The Unreasonably Successful Criminal'

      endingText =
          'The entire envelope is gone. Alexander is displeased, ' +
          'but the hotel cannot establish who took it. ' +
          'Meanwhile, his executives will not stop talking about ' +
          'the stranger who somehow improved their meetings. ' +
          'He offers you a job. ' +
          honestyJobExplanation +
          ' Your debt is paid, you still have $3,140, ' +
          'and you are now employed. ' +
          'You are not sure what lesson to take from this.'
    } else {
      endingTitle = 'The Perfect Getaway'

      endingText =
          'The entire envelope disappeared, and nobody can conclusively ' +
          'establish what happened to it. ' +
          'Alexander has no reason to hire you, ' +
          'but no proof with which to accuse you either. ' +
          'Your debt is paid. ' +
          'You leave with $3,140, no job, ' +
          'and a renewed appreciation for hotels that ask absolutely no questions.'
    }
  } else if (impressed) {
    endingTitle = betterJob
        ? 'An Unexpected Promotion'
        : 'The Accidental Hire'

    endingText =
        'An executive paid off your $4,860 debt at the event, ' +
        'apparently believing it was an eccentric demonstration of philanthropy. ' +
        'Alexander listens to the account of your meetings. ' +
        'Somehow, his executives liked your decisions. ' +
        'He offers you a job. ' +
        honestyJobExplanation +
        (betterJob
            ? ' You missed your original interview, but somehow secured a better opportunity.'
            : ' You missed your actual interview and got hired by somebody else entirely.')
  } else {
    endingTitle = 'A Very Expensive Free Vacation'

    endingText =
        'Your $4,860 debt was paid at the event. ' +
        'You did not impress the executives enough for a job offer, ' +
        'but Alexander sees little point in prolonging the confusion. ' +
        'You leave unemployed and without a home, ' +
        'yet debt-free and exceptionally well rested. ' +
        'It could have been worse. ' +
        'It also could have involved an actual job interview.'
  }

const lastDecision = log[log.length - 1]
  const executiveReaction = answer !== null && (lastDecision?.favor ?? 0) > 0 &&
    ['interview', 'event', 'elevator'].includes(stage)
    ? lastDecision.favor === 3
      ? 'The response lands remarkably well. Several executives exchange approving looks.'
      : lastDecision.favor === 2
        ? 'The executives seem satisfied, although nobody is calling it revolutionary.'
        : 'The response passes, but at least one executive looks unconvinced.'
    : null

  return <section className="story">
    {stage === 'breakfast' && <>{heading('TUESDAY · 8:03 AM','Breakfast of Champions')}<p>You wake to a knock. Breakfast arrives on a trolley large enough to require planning permission.</p><p>There are pastries, fruit, eggs, three kinds of juice, and a silver pot of coffee. Someone has also sent a suit in your size.</p><p>"The meeting begins shortly, Mr. Morgan. Shall we tell them you're on your way?"</p><p className="alex-reaction">The interview. Of course. Apparently the breakfast is a recruitment benefit.</p>{options([
      {title:'"Is all of this included in the $200?"',detail:'"Naturally, sir." You decide not to ask what unnaturally would cost.'},
      {title:'"Wonderful. More coffee, please."',detail:'The employee nods. You have apparently become a person who requests coffee by the pot.'},
      {title:'"I think you have the wrong person. Please check."',detail:'"Of course, Mr. Morgan. We have checked." That is not reassuring.',honesty:1},
      {title:'"Could you pack the leftovers? I have somewhere to be."',detail:'The employee looks briefly startled, then begins wrapping a croissant in tissue paper.'}
    ])}</>}
    {stage === 'envelope' && <>{heading('TUESDAY · 8:34 AM','Compliments of Someone Else')}<p>Beside the suit sits a sealed envelope, marked PRIVATE — ALEXANDER J. MORGAN. Inside is $8,000 in cash.</p><p>You owe $4,860. You count the money again, as though arithmetic might have changed since breakfast.</p><p className="alex-reaction">That is a very convenient amount of somebody else's money.</p>{options([
      {title:'Take the entire $8,000.',detail:'You take the envelope. There is no money left behind to announce a precise shortfall.',cash:'all'},
      {title:'Take exactly $4,860. Not a cent more.',detail:'You leave $3,140 behind. It feels restrained. It also makes the missing amount rather obvious.',cash:'partial'},
      {title:'Leave the envelope untouched.',detail:'You put it back exactly where you found it. Being responsible is becoming expensive.',cash:'none'},
      {title:'Tell reception these are not your belongings.',detail:'Reception thanks you for your diligence and insists everything is correct. At least someone heard you say it.',cash:'none',honesty:1}
    ])}</>}
    {stage === 'interview' && <>{heading('TUESDAY · 9:12 AM','The Interview')}<p>A staff member ushers you into a boardroom. Twelve people in expensive suits stand when you enter.</p><p className="alex-reaction">A panel interview. Twelve people. This company is either very thorough or extremely understaffed.</p><p>"Alexander," says a woman at the head of the table, "are we proceeding with the restructuring?"</p><p>You do not remember applying for a restructuring job.</p>{options([
      {title:'"Let’s hear everyone’s concerns before we proceed."',detail:'The room relaxes. Several executives nod thoughtfully.',base:2,plus:'F',minus:'T'},
      {title:'"Show me the actual figures before we decide."',detail:'Someone immediately opens a spreadsheet. The executives seem relieved that you asked.',base:2,plus:'S',minus:'N'},
      {title:'"I think we need an entirely different approach."',detail:'A long silence follows. Someone writes the word VISION on a notepad.',base:2,plus:'N',minus:'J'},
      {title:'"I’m sorry. I think you have the wrong person."',detail:'"Very funny, Alexander," says an executive. Nobody laughs quite enough.',honesty:1}
     ])}{executiveReaction && <p className="alex-reaction">{executiveReaction}</p>}</>}
    {stage === 'missed' && <>{heading('TUESDAY · 11:06 AM','The Actual Interview')}<p>You finally find the recruitment desk. The receptionist looks at your name and winces.</p><p>"Your interview was at nine. We called twice."</p><p>At nine, you were in a boardroom discussing the future of a company you do not work for.</p><p className="alex-reaction">Excellent. Unemployed in two different ways.</p><p>{cash === 'none' ? 'Back in the suite, the envelope is still waiting.' : 'Back in the suite, you stare at the place where the envelope used to be.'}</p>{cash === 'none' ? options([
      {title:'Take all $8,000. Circumstances have changed.',detail:'You take the entire envelope. Circumstances have indeed changed.',cash:'all'},
      {title:'Take just $4,860 to pay the debt.',detail:'You leave the rest. The exact shortfall may be difficult to explain.',cash:'partial'},
      {title:'Leave the money alone.',detail:'You close the drawer. It takes more willpower than you expected.'},
      {title:'Warn reception about the envelope again.',detail:reportedEnvelope?'"Yes, Mr. Morgan, you mentioned that." They still do not seem concerned.':'Reception promises to make a note. You hope they actually do.',honesty:1}
    ]) : options([
      {title:'Go to the corporate event.',detail:'Your real interview is gone. Apparently your schedule has other plans.'},
      {title:'Tell reception you were sent to the wrong interview.',detail:'Reception assures you the morning meeting was exactly where you were expected. At least you tried to explain.',honesty:1}
    ])}</>}
    {stage === 'event' && <>{heading('TUESDAY · 7:15 PM','The Guest of Honor')}<p>The ballroom is full of executives, champagne, and people who describe ordinary decisions as strategic initiatives.</p>{cash === 'none' ? <><p>Someone you borrowed money from spots you across the room. "Alex! I've been trying to reach you. You owe me $4,860!"</p><p>You open your mouth to explain, but your creditor continues. 'I've called you six times. You can't just disappear!' Several heads turn. You briefly consider hiding behind an ice sculpture. An executive bursts out laughing. "Alexander, what an extraordinary way to make a point about small debts!"</p><p>You try to explain that this is not a demonstration of anything. He waves you off and transfers the money to your creditor anyway. Your creditor checks the payment, looks at you suspiciously, and leaves.</p><p className="alex-reaction">You are officially debt-free. You have no idea what point you made.</p></> : <><p>Earlier, you used the cash to settle your $4,860 debt. At least that particular problem can no longer follow you into a ballroom.</p><p className="alex-reaction">One less disaster to worry about. Several remain available.</p></>}<p>An organizer hands you a microphone. "Mr. Morgan, a few words about the company's future?"</p>{options([
      {title:'Deliver an improvised speech.',detail:'You say several things about resilience, opportunity, and the future. Somehow people applaud.',base:2,plus:'E',minus:'I'},
      {title:'Praise the employees who keep everything running.',detail:'The staff look surprised. The executives look thoughtful.',base:2,plus:'F',minus:'T'},
      {title:'Suggest a practical plan to improve operations.',detail:'You point out the obvious problems nobody seems to have noticed. Several people take notes.',base:2,plus:'S',minus:'P'},
      {title:'Tell the organizer they have the wrong guest of honor.',detail:'"Of course, Mr. Morgan. Very modest." The microphone remains in your hand.',honesty:1}
     ])}{executiveReaction && <p className="alex-reaction">{executiveReaction}</p>}</>}
    {stage === 'overstay' && <>{heading('WEDNESDAY · 2:47 PM','Late Checkout')}<p>You wake up. The room is quiet. Your reservation covered Monday night. Checkout was supposed to be Tuesday at noon. It is now Wednesday afternoon.</p><p>Nobody has called. Nobody has knocked. You have apparently overstayed in the most expensive room in the building, and the hotel seems delighted.</p><p className="alex-reaction">At a normal hotel, this would cost approximately one kidney.</p>{options([
      {title:'Say nothing and stay another night.',detail:'You return to the bed. The pillows remain numerous.'},
      {title:'Call and ask whether checkout has passed.',detail:'"Your stay is entirely at your discretion, Mr. Morgan." You point out you only booked one night. They thank you for clarifying.',honesty:1},
      {title:'Explain you booked one night and are not their VIP.',detail:'"I assure you we have your reservation correct, sir." Another warning ignored.',honesty:1},
      {title:'Request another night on the executive account.',detail:'"Already arranged, Mr. Morgan." You are beginning to understand why billionaires seem so relaxed.'}
    ])}</>}
    {stage === 'elevator' && <>{heading('THURSDAY · 9:08 AM','Going Up')}<p>The elevator doors close. A senior executive is standing beside you.</p><p>"Alexander! Perfect timing. The acquisition. Should I tell the board we're moving ahead?"</p><p>There are twenty floors left to travel. The executive waits.</p>{options([
      {title:'"Yes. Move forward."',detail:'"Decisive as always," the executive says, making a note.',base:2,plus:'J',minus:'P'},
      {title:'"Not until we’ve assessed the risks."',detail:'The executive looks impressed. "I knew you would insist on due diligence."',base:2,plus:'T',minus:'F'},
      {title:'"What would you recommend?"',detail:'The executive launches into a careful explanation. Apparently asking questions is leadership.',base:2,plus:'I',minus:'E'},
      {title:'"I am not Alexander J. Morgan."',detail:'The executive chuckles nervously. "Right. Of course." You are running out of ways to say it.',honesty:1}
     ])}{executiveReaction && <p className="alex-reaction">{executiveReaction}</p>}</>}
    {stage === 'alexander' && <>{heading('THURSDAY · 11:21 AM','The Other Alexander')}<p>There is a commotion in the lobby. A man arrives with a small entourage, an expensive coat, and a face that looks nothing like yours.</p><p>"I'm Alexander J. Morgan," he tells the receptionist.</p><p>The receptionist looks at him. Then at you.</p><p>For the first time since you arrived, the hotel is completely silent.</p><p>Alexander asks to speak to you privately. He has already heard about the meetings, the event, and the suite.</p>{cash === 'partial' ? <p>He has also been told that exactly $4,860 is missing from his envelope.</p> : cash === 'all' ? <p>He knows an envelope disappeared, although nobody can establish who took it.</p> : <p>His belongings are accounted for. At least there is one thing nobody can argue about.</p>}<p>"So," he says, sitting down. "Tell me how you ended up running my week."</p><button className="primary-button" onClick={() => setStage('ending')}>Find out what happens →</button></>}
    {stage === 'ending' && <>{heading('THURSDAY · THE VERDICT',endingTitle)}<p>{endingText}</p>{betterJob && <p className="alex-reaction">BONUS: Your {honesty} attempts to correct the mistake helped earn you a better position. The hotel might want to work on its listening skills.</p>}<div className="chapter-end">THE END</div><div className="confirmation" style={{padding:18,marginTop:20}}><h2>YOUR CASE FILE</h2><p><strong>Personality:</strong> {personality}</p><p><strong>Honesty:</strong> {honesty} / 6 warnings {honesty>=4?'— unusually persistent':''}</p><p><strong>Executive approval:</strong> {favor} / 9 points — {impressed?'impressed':'not impressed'} (job threshold: 4)</p><p><strong>Envelope:</strong> {cash==='none'?'Untouched':`$${cashAmount(cash).toLocaleString()} taken`}</p><p><strong>Debt:</strong> {debtPaid?'$4,860 paid':'$4,860 — payment not recorded'}</p><p><strong>Money left from envelope:</strong> ${Math.max(0,cashAmount(cash)-debt).toLocaleString()}</p><p><strong>Job:</strong> {cash==='partial'&&!impressed?'None — under investigation':impressed?(betterJob?'Better position (honesty bonus)':'Job offered'):'No immediate offer'}</p><h3>WHAT YOUR CHOICES DID</h3>{log.map((entry,i)=><p key={i} style={{fontSize:'.88rem',borderBottom:'1px solid #8884',paddingBottom:8}}><strong>{entry.scene.toUpperCase()}:</strong> {entry.action}<br/>Honesty +{entry.honesty} · Executive +{entry.favor} · {entry.note}</p>)}</div><button className="restart-button" onClick={onRestart ?? (() => window.location.reload())}>Play again ↺</button></>}
  </section>
}
