import { useState } from 'react'
import NextChapters from './NextChapters'
import './App.css'

type Page =
    | 'setup'
    | 'intro'
    | 'search'
    | 'details'
    | 'confirmed'
    | 'transport'
    | 'arrival'
    | 'chapters'

const hotelResponses: Record<string, string> = {
  '75': 'Have you considered being wealthier?',
  '100': 'We admire your optimism. Unfortunately, optimism is not an accepted payment method.',
  '150': "Perhaps you're looking for a hotel in a different tax bracket.",
  '200': "Congratulations! You've found a room. Have you considered financing a car instead?",
  '9999': 'No budget limit? How exciting! Would you like to reconsider that statement before your bank does?',
}

function App() {
  const [page, setPage] = useState<Page>('setup')
  const [budget, setBudget] = useState('100')
  const [searched, setSearched] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  const [transportStep, setTransportStep] = useState(0)
  const [competitorStep, setCompetitorStep] = useState(0)
  const [arrivalChoice, setArrivalChoice] = useState<string | null>(null)

  const [playerName, setPlayerName] = useState('')
  const [appearance, setAppearance] = useState('Unreasonably attractive')
  const [knowsMBTI, setKnowsMBTI] = useState(true)
  const [selectedMBTI, setSelectedMBTI] = useState('INTP')
  const [mbtiAnswers, setMbtiAnswers] = useState(['', '', '', ''])
  const [setupComplete, setSetupComplete] = useState(false)

  const mbti = knowsMBTI
      ? selectedMBTI
      : mbtiAnswers.join('')

  const roomAvailable = Number(budget) >= 200

  function goBack() {
    if (page === 'arrival') setPage('transport')
    else if (page === 'transport') setPage('confirmed')
    else if (page === 'confirmed') setPage('details')
    else if (page === 'details') setPage('search')
    else if (page === 'search') setPage('intro')
  }
  function searchRooms() {
    setSearched(true)
    setSearchCount((count) => count + 1)
  }

  return (
      <main className="game">
        <div className="game-card">
          <header className="game-header">
            <span>WRONG PERSON, RIGHT PLACE</span>
            <span>
          {page === 'setup'
              ? 'CHARACTER CREATION'
              : page === 'chapters'
                  ? 'THE STORY'
                  : 'PROLOGUE'}
        </span>
          </header>

          {page !== 'setup' &&
              page !== 'intro' &&
              page !== 'chapters' && (
                  <button
                      className="back-button"
                      onClick={goBack}
                  >
                    ← Back
                  </button>
              )}

          {page === 'setup' && (
              <section className="story">
                {!setupComplete ? (
                    <>
                      <p className="time">CHARACTER CREATION</p>
                      <h1>Before We Begin</h1>

                      <p>
                        Every great story needs a protagonist. Let's make yours.
                      </p>

                      <p>
                        Please take this very seriously. We certainly will.
                      </p>

                      <div className="booking-site">
                        <label className="filter-label">
                          What would you like to be called?
                        </label>

                        <input
                            className="character-input"
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                        />

                        <p className="filter-label">
                          How would you describe your appearance?
                        </p>
                        <div className="budget-options">
                          {[
                            'Unreasonably attractive',
                            'Tired, but presentable',
                            'A work in progress',
                            'An acquired taste'
                          ].map((option) => (
                              <label className="budget-option" key={option}>
                                <input
                                    type="radio"
                                    name="appearance"
                                    checked={appearance === option}
                                    onChange={() => setAppearance(option)}
                                />
                                <span>{option}</span>
                              </label>
                          ))}
                        </div>

                        <p className="filter-label">
                          Do you know your MBTI type?
                        </p>
                        <div className="budget-options">
                          <label className="budget-option">
                            <input
                                type="radio"
                                checked={knowsMBTI}
                                onChange={() => setKnowsMBTI(true)}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="budget-option">
                            <input
                                type="radio"
                                checked={!knowsMBTI}
                                onChange={() => setKnowsMBTI(false)}
                            />
                            <span>No / Not sure</span>
                          </label>
                        </div>

                        {knowsMBTI ? (
                            <>
                              <p className="filter-label">Select your type</p>
                              <select
                                  className="character-input"
                                  value={selectedMBTI}
                                  onChange={(e) => setSelectedMBTI(e.target.value)}
                              >
                                {[
                                  'INTJ', 'INTP', 'ENTJ', 'ENTP',
                                  'INFJ', 'INFP', 'ENFJ', 'ENFP',
                                  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
                                  'ISTP', 'ISFP', 'ESTP', 'ESFP'
                                ].map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                ))}
                              </select>
                            </>
                        ) : (
                            <>
                            <p>
                                Not sure? Pick whichever sounds more like you.
                                There are no wrong answers.
                              </p>

                              {[
                                {
                                  question: "You've had a long, exhausting week. What sounds better?",
                                  options: [
                                    ['I', 'Canceling plans, going home, and enjoying some peace and quiet.'],
                                    ['E', 'Going out, seeing people, and doing something fun.']
                                  ]
                                },
                                {
                                  question: 'Someone tells you about a strange situation. What do you naturally focus on?',
                                  options: [
                                    ['S', 'What actually happened, what they said, and the details.'],
                                    ['N', 'What it could mean, what might happen next, and the possibilities.']
                                  ]
                                },
                                {
                                  question: 'A friend asks for advice after an argument. What is your instinct?',
                                  options: [
                                    ['T', "Figure out who's right, what went wrong, and how to fix it."],
                                    ['F', 'Understand how everyone feels and what would make things better.']
                                  ]
                                },
                                {
                                  question: "You're going on a trip. How do you prepare?",
                                  options: [
                                    ['J', 'Book things ahead, make a plan, and know what you are doing.'],
                                    ['P', 'Sort out the essentials and figure out the rest as you go.']
                                  ]
                                }
                              ].map((question, index) => (
                                  <div key={index}>
                                    <p className="filter-label">{question.question}</p>
                                    <div className="budget-options">
                                      {question.options.map(([letter, description]) => (
                                          <label className="budget-option" key={letter}>
                                            <input
                                                type="radio"
                                                name={`mbti-${index}`}
                                                checked={mbtiAnswers[index] === letter}
                                                onChange={() =>
                                                    setMbtiAnswers((previous) =>
                                                        previous.map((answer, i) =>
                                                            i === index ? letter : answer
                                                        )
                                                    )
                                                }
                                            />
                                            <span>{description}</span>
                                          </label>
                                      ))}
                                    </div>
                                  </div>
                              ))}

                              {mbtiAnswers.every(Boolean) && (
                                  <p className="booking-note">
                                    Your approximate type: {mbtiAnswers.join('')}
                                  </p>
                              )}
                            </>
                        )}

                        <button
                            className="primary-button"
                            disabled={!knowsMBTI && !mbtiAnswers.every(Boolean)}
                            onClick={() => setSetupComplete(true)}
                        >
                          Create my character →
                        </button>
                      </div>
                    </>
                ) : (
                    <>
                      <p className="time">CHARACTER ASSIGNMENT COMPLETE</p>
                      <h1>Thank you for your input.</h1>

                      <p>Your preferences have been carefully considered.</p>
                      <p>
                        Unfortunately, you appear to be under the impression
                        that you were being consulted.
                      </p>

                      <div className="confirmation">
                        <span>YOUR ASSIGNED IDENTITY</span>
                        <strong>Alex Morgan</strong>
                        <p>Appearance: Already determined</p>
                        <p>Personality: To be seen</p>
                        <p>Current employment: None</p>
                      </div>

                      <p>
                        Much like being born, you don't get to choose
                        the circumstances you're handed.
                      </p>
                      <p>
                        You do, however, get to decide what to do with them.
                      </p>

                      <p>Welcome to your life, Alex.</p>

                      <button
                          className="primary-button"
                          onClick={() => setPage('intro')}
                      >
                        Begin →
                      </button>
                    </>
                )}
              </section>
          )}


          {page === 'intro' && (
              <>
                <section className="story">
                  <p className="time">MONDAY · 9:17 AM</p>

                  <p>Your phone buzzes. A reminder. Your landlord has decided to raise the rent by thirty percent.</p>

                  <p>
                    You're not entirely sure what improvements he's made to the
                    apartment to justify this. The ceiling still leaks, the
                    heating has a personality of its own, and the kitchen
                    cabinet has been threatening to fall off its hinges since March.
                  </p>

                  <p>Perhaps he's charging extra for the suspense.</p>

                  <p>
                    Funny how some people can simply decide to increase their
                    income. Perhaps you should start doing the same.
                  </p>

                  <p>
                    Although, having lost your job three weeks ago, you aren't
                    entirely sure whom you'd send the notice to.
                  </p>

                  <p>
                    You've been living on borrowed money ever since, which makes
                    this a particularly inconvenient time for your landlord to
                    discover his entrepreneurial spirit.
                  </p>

                  <p>And then there's the eviction notice.</p>

                  <p>
                    You've been given until the end of the day to leave. Your
                    landlord was kind enough to suggest finding alternative
                    accommodation, an idea you suspect would never have
                    occurred to you otherwise.
                  </p>

                  <p>
                    You consider calling your landlord to negotiate.
                    Unfortunately, you suspect he's quite attached to
                    the concept of being paid.
                  </p>

                  <p>Still, you have a job interview tomorrow.</p>

                  <p>
                    It's the first company to invite you in since you lost
                    your job, and you've spent the past three days preparing
                    for it. You'd rather not get your hopes up, but you've
                    already caught yourself calculating what you could
                    afford with the salary.
                  </p>

                  <p>
                    Perhaps you should concentrate on finding somewhere
                    to sleep before you start furnishing an imaginary apartment.
                  </p>

                  <p>
                    By six o'clock, you've packed everything you can carry
                    and arranged somewhere to leave the rest.
                  </p>

                  <p>
                    You need somewhere to stay tonight. Preferably somewhere
                    you can shower, iron your interview clothes, and convince
                    yourself you're a functioning member of society.
                  </p>

                  <p>
                    You briefly consider asking a friend to let you sleep
                    on their couch. Unfortunately, most of your friends
                    have already contributed to your continued existence
                    financially, and you'd rather not expand your
                    collection of debts.
                  </p>

                  <p>
                    A hotel, then. Just for tonight. You can figure out
                    the rest after the interview.
                  </p>

                  <p>You open a booking website.</p>
                </section>

                <button
                    className="primary-button"
                    onClick={() => setPage('search')}
                >
                  Find a room →
                </button>
              </>
          )}

          {page === 'search' && (
              <section className="story">
                <p className="time">MONDAY · 6:08 PM</p>

                <div className="booking-site">
                  <div className="booking-header">
                    <div>
                      <h2>ROOMFINDER</h2>
                      <small>Your comfort. Our commission.</small>
                    </div>
                    <span>✦</span>
                  </div>

                  <p className="booking-intro">
                    Find your perfect stay. Or whatever you can afford.
                  </p>

                  <label className="filter-label">
                    Maximum nightly budget
                  </label>

                  <div className="budget-options">
                    {[
                      ['75', 'Under $75'],
                      ['100', 'Under $100'],
                      ['150', 'Under $150'],
                      ['200', '$200 or less'],
                      ['9999', 'No limit — a bold financial statement'],
                    ].map(([value, label]) => (
                        <label className="budget-option" key={value}>
                          <input
                              type="radio"
                              name="budget"
                              value={value}
                              checked={budget === value}
                              onChange={() => {
                                setBudget(value)
                                setSearched(false)
                              }}
                          />
                          <span>{label}</span>
                        </label>
                    ))}
                  </div>

                  <button
                      className="primary-button"
                      onClick={searchRooms}
                  >
                    Search available rooms →
                  </button>

                  {searched && (
                      <div className="search-results" key={searchCount}>
                        <p className="result-count">
                          {roomAvailable
                              ? '1 ROOM AVAILABLE'
                              : '0 ROOMS AVAILABLE'}
                        </p>

                        <p className="website-insult">
                          {hotelResponses[budget]}
                        </p>

                        {budget === '75' && (
                            <p className="alex-reaction">
                              I'll look into it.
                            </p>
                        )}

                        {budget === '9999' && (
                            <p className="alex-reaction">
                              I was hoping you'd take that as a suggestion
                              rather than a challenge.
                            </p>
                        )}

                        {!roomAvailable && (
                            <p className="booking-note">
                              Demand is exceptionally high. Have you
                              tried being born earlier?
                            </p>
                        )}

                        {roomAvailable && (
                            <>
                              <p className="booking-note">
                                Only one room remaining! We'd hate for
                                you to miss this opportunity to make
                                a questionable financial decision.
                              </p>

                              <button
                                  className="hotel-result"
                                  onClick={() => setPage('details')}
                              >
                                <div className="hotel-placeholder">
                                  <span>▧</span>
                                  <small>IMAGE UNAVAILABLE</small>
                                </div>

                                <div className="hotel-result-info">
                                  <strong>The Roskosh</strong>
                                  <small>One room remaining</small>
                                  <span className="result-price">$200</span>
                                  <small className="view-property">
                                    View property →
                                  </small>
                                </div>
                              </button>
                            </>
                        )}
                      </div>
                  )}
                </div>
              </section>
          )}

          {page === 'details' && (
              <section className="story">
                <p className="time">MONDAY · 6:42 PM</p>

                <div className="booking-site">
                  <div className="booking-header">
                    <div>
                      <h2>ROOMFINDER</h2>
                      <small>Your comfort. Our commission.</small>
                    </div>
                    <span>✦</span>
                  </div>

                  <h2 className="property-name">The Roskosh</h2>

                  <div className="missing-gallery">
                    <span className="gallery-icon">▧</span>
                    <strong>No photographs available</strong>
                    <p>
                      We believe true luxury should be
                      left to the imagination.
                    </p>
                  </div>

                  <p>
                    An exceptional luxury hotel offering an
                    unforgettable experience in the heart of the city.
                  </p>

                  <h3 className="property-subheading">Amenities</h3>

                  <div className="amenities">
                    <p>✦ Complimentary Wi-Fi</p>
                    <p>✦ Breakfast available (additional cost)</p>
                    <p>✦ 24-hour concierge</p>
                    <p>✦ Financial regret not included</p>
                  </div>

                  <h3 className="property-subheading">Property notice</h3>

                  <p className="property-notice">
                    The Roskosh is proud to host a prestigious
                    corporate gathering featuring guest of honor
                    Alexander J. Morgan.
                  </p>

                  <p className="alex-reaction">
                    Alexander Morgan. Your name is Alex Morgan.
                    Funny. You wonder whether the middle initial
                    comes with the money.
                  </p>

                  <div className="room-price-card">
                    <div>
                      <strong>Standard Room</strong>
                      <small>One night · Non-refundable</small>
                    </div>
                    <span>$200</span>
                  </div>

                  <p className="website-insult">
                    By proceeding, you acknowledge that money is
                    temporary and our cancellation policy is permanent.
                  </p>

                  <button
                      className="primary-button"
                      onClick={() => setPage('confirmed')}
                  >
                    Book for $200 →
                  </button>
                </div>
              </section>
          )}

          {page === 'confirmed' && (
              <section className="story">
                <p className="time">MONDAY · 6:47 PM</p>

                <div className="confirmation">
                  <span>THE ROSKOSH</span>
                  <strong>Alex Morgan</strong>
                  <p>Standard Room · One Night</p>
                  <p>Payment received: $200.00</p>
                  <span className="confirmed">CONFIRMED</span>
                </div>

                <div className="booking-site website-farewell">
                  <strong>ROOMFINDER</strong>
                  <p>
                    Thank you for your purchase! Remember,
                    you can always earn more money.
                  </p>
                </div>

                <p className="thought">
                  What an excellent idea. I wonder why I
                  hadn't thought of that.
                </p>

                <p>Two hundred dollars have left your bank account.</p>

                <p>
                  In return, you have received an email promising
                  the existence of a room.
                </p>

                <p>You suppose that's a fair exchange.</p>

                <p>
                  You look over the confirmation again.
                  The Roskosh. One night. Non-refundable.
                </p>

                <p>
                  Non-refundable. A charming little detail they
                  seem particularly enthusiastic about.
                </p>

                <p>
                  Still, the hotel has excellent reviews.
                  Or at least you assume it does.
                  You didn't actually check.
                </p>

                <p>
                  You consider checking now, but decide against it.
                  There's very little to be gained from discovering
                  you've made a terrible decision after losing
                  the ability to reverse it.
                </p>

                <p>
                  Besides, it's only one night. How bad could
                  it possibly be?
                </p>

                <p>You put your phone away and pick up your bags.</p>

                <p>Time to see what two hundred dollars buys you.</p>

                <div className="chapter-end">
                  END OF PROLOGUE
                </div>

                <button
                    className="primary-button"
                    onClick={() => setPage('transport')}
                >
                  Find a way to the hotel →
                </button>
              </section>
          )}

          {page === 'transport' && (
              <section className="story">
                <p className="time">MONDAY · 6:49 PM</p>
                <h1>Getting There</h1>
                <p>You check the route to The Roskosh.</p>
                <p>Fifteen minutes by car. Forty-seven on foot.</p>
                <p>You've already spent two hundred dollars on a hotel room. Surely transportation won't be another financial crisis.</p>
                <div className="booking-site">
                  <div className="booking-header">
                    <div><h2>GOFARE</h2><small>We'll get you there. Probably.</small></div>
                    <span>RIDES</span>
                  </div>

                  {transportStep === 0 && (
                      <>
                        <p>You enter The Roskosh as your destination.</p>
                        <div className="fare-card"><span>GOFARE STANDARD · 15 MIN</span><strong>$18.50</strong><small>Price subject to change for reasons we may or may not explain.</small></div>
                        <p>Eighteen dollars and fifty cents.</p>
                        <p>For sitting in a car.</p>
                        <p>Perhaps you could sit in one without asking it to move.</p>
                        <p>You decide the app needs some time to reconsider its position.</p>
                        <button className="primary-button" onClick={() => setTransportStep(1)}>Close GOFARE</button>
                      </>
                  )}
                  {transportStep === 1 && (
                      <>
                        <div className="closed-app"><strong>GOFARE is closed.</strong></div>
                        <p>There.</p><p>You give it a moment to reflect on its pricing strategy.</p>
                        <button className="primary-button" onClick={() => setTransportStep(2)}>Open GOFARE again</button>
                      </>
                  )}
                  {transportStep === 2 && (
                      <>
                        <div className="fare-card"><span>UPDATED FARE</span><strong>$18.43</strong><small className="fare-drop">Price dropped $0.07</small></div>
                        <p>Seven cents.</p><p>You stare at the screen.</p>
                        <p className="alex-reaction">Listen here. This isn't going to work for me.</p>
                        <p>Clearly, you need to demonstrate that you have other options.</p>
                        <p>The app should understand that your loyalty is not unconditional.</p>
                        <button className="primary-button" onClick={() => setTransportStep(3)}>Check competing ride apps</button>
                      </>
                  )}
                  {transportStep === 3 && (
                      <>
                        <p className="result-count">OTHER RIDES NEAR YOU</p>
                        {competitorStep === 0 && (
                            <>
                              <div className="fare-card"><span>ZIPRIDE</span><strong>$22.90</strong><small>Driver arriving in 18 minutes.</small></div>
                              <p>More expensive.</p><p className="alex-reaction">But GOFARE doesn't need to know that.</p>
                              <button className="primary-button" onClick={() => setCompetitorStep(1)}>Check another app</button>
                            </>
                        )}
                        {competitorStep === 1 && (
                            <>
                              <div className="fare-card"><span>MOTOGO</span><strong>$26.40</strong><small>Only premium vehicles available.</small></div>
                              <p>Premium?</p><p>You'd accept a shopping cart with an engine at this point.</p>
                              <button className="primary-button" onClick={() => setCompetitorStep(2)}>Check another app</button>
                            </>
                        )}
                        {competitorStep === 2 && (
                            <>
                              <div className="fare-card"><span>WHEELY</span><strong>$19.75</strong><small>Limited driver availability.</small></div>
                              <p>Still worse.</p><p>But you've now visited three competitors. Surely GOFARE has noticed your absence.</p>
                              <p>Surely it's getting nervous.</p>
                              <button className="primary-button" onClick={() => setCompetitorStep(3)}>Close the competitors</button>
                            </>
                        )}
                        {competitorStep === 3 && (
                            <>
                              <div className="closed-app"><strong>All competing apps closed.</strong></div>
                              <p>You have made your point.</p><p>Time to see what GOFARE has to say for itself.</p>
                              <button className="primary-button" onClick={() => setTransportStep(4)}>Reopen GOFARE</button>
                            </>
                        )}
                      </>
                  )}
                  {transportStep === 4 && (
                      <>
                        <div className="fare-card"><span>GOFARE STANDARD · UPDATED FARE</span><strong>$37.00</strong><small className="surge-label">HIGH DEMAND · SURGE PRICING</small></div>
                        <p>...</p><p>Thirty-seven dollars.</p><p>You close your eyes.</p><p>You open them again.</p><p>Thirty-seven dollars.</p>
                        <p>The price has doubled.</p>
                        <p>Apparently, GOFARE has decided to respond to your threats with threats of its own.</p>
                        <p className="website-insult">GOFARE: Demand is currently high! Consider waiting for a better fare.</p>
                        <p className="alex-reaction">I DID WAIT.</p>
                        <p>Perhaps public transport is the answer.</p>
                        <button className="primary-button" onClick={() => setTransportStep(5)}>Check the bus schedule</button>
                      </>
                  )}
                  {transportStep === 5 && (
                      <>
                        <div className="fare-card bus-schedule"><span>CITY TRANSIT</span>
                          <div className="schedule-row"><span>Last bus</span><strong>Departed 2 minutes ago</strong></div>
                          <div className="schedule-row"><span>Next bus</span><strong>Tomorrow, 6:30 AM</strong></div>
                        </div>
                        <p>Two minutes.</p><p>You were two minutes away from having a perfectly reasonable evening.</p>
                        <p>You check the schedule again.</p><p>Remarkably, it hasn't changed.</p>
                        <p>The next bus arrives tomorrow morning, which is excellent news for tomorrow morning.</p>
                        <p>You look at the walking directions.</p><p>Forty-seven minutes.</p><p>You look at your bags.</p><p>You look at the directions again.</p>
                        <p>Walking is excellent for your health, apparently.</p>
                        <p>You briefly consider whether carrying most of your worldly possessions counts as strength training.</p>
                        <p>At least you won't have to pay for a gym membership.</p>
                        <div className="fare-card"><span>WALKING DIRECTIONS</span><strong>47 minutes</strong><small>Fare: $0.00 · Physical suffering: Included</small></div>
                        <button className="primary-button" onClick={() => setPage('arrival')}>Walk to The Roskosh →</button>
                      </>
                  )}
                </div>
              </section>
          )}

          {page === 'arrival' && (
              <section className="story">
                <p className="time">MONDAY · 7:40 PM</p>
                <h1>The Roskosh</h1>
                <p>You arrive at The Roskosh on foot.</p>
                <p>In hindsight, walking here with two bags containing most of your remaining possessions was perhaps an ambitious decision.</p>
                <p>Your shoulders hurt. Your feet hurt. One of your suitcase wheels has developed a noise that suggests it won't be accompanying you much further in life.</p>
                <p>The hotel, meanwhile, looks like the sort of establishment where people arrive in vehicles with drivers.</p>
                <p>There are chandeliers. Several of them. You'd always assumed one was sufficient.</p>
                <p>A man in a very expensive looking suit is arguing with a receptionist about the temperature of his champagne.</p>
                <p>You wonder whether he'd like to trade problems.</p>
                <p>You approach the front desk.</p>
                <p>"Reservation for Alex Morgan."</p>
                <p>The receptionist looks at her screen. Then at you. Then back at her screen.</p>
                <p>"Mr. Morgan! Welcome to The Roskosh. We've been expecting you."</p>
                <p className="alex-reaction">Well, yes. That's generally how reservations work.</p>
                <p>"We've taken the liberty of upgrading your accommodation to our presidential suite."</p>
                <p>You blink.</p><p>"The what?"</p>
                <p>"The presidential suite, sir. Naturally, there will be no additional charge."</p>
                <p className="alex-reaction">Naturally?</p>
                <p>You look down at your overnight bag. One of the handles is held together with tape.</p>
                <p>You look back at the receptionist.</p>
                <p>"Is there something wrong with the room I booked?"</p>
                <p>"Not at all, Mr. Morgan. We simply felt it would be more appropriate."</p>
                <p className="alex-reaction">Appropriate for what? A coronation?</p>
                {arrivalChoice === null ? (
                    <>
                      <p className="chapter-end">HOW DO YOU RESPOND?</p>

                      <div className="budget-options">
                        <button
                            className="budget-option"
                            onClick={() => setArrivalChoice('innocent')}
                        >
                          "Are you sure you have the right reservation?"
                        </button>

                        <button
                            className="budget-option"
                            onClick={() => setArrivalChoice('curious')}
                        >
                          "And what exactly makes it more appropriate?"
                        </button>

                        <button
                            className="budget-option"
                            onClick={() => setArrivalChoice('accept')}
                        >
                          "Well, if you insist."
                        </button>

                        <button
                            className="budget-option"
                            onClick={() => setArrivalChoice('bold')}
                        >
                          "I should hope so. I've had a rather exhausting day."
                        </button>
                      </div>

                    </>
                ) : (
                    <>

                      {arrivalChoice === 'innocent' && (
                          <>
                            <p>"Are you sure you have the right reservation?"</p>
                            <p>"Absolutely, Mr. Morgan. Everything is in order."</p>
                          </>
                      )}

                      {arrivalChoice === 'curious' && (
                          <>
                            <p>"And what exactly makes it more appropriate?"</p>
                            <p>"Given your importance to tomorrow's proceedings, sir."</p>
                            <p className="alex-reaction">
                              Proceedings? You have an interview tomorrow.
                              Perhaps this hotel takes recruitment unusually seriously.
                            </p>
                          </>
                      )}

                      {arrivalChoice === 'accept' && (
                          <>
                            <p>"Well, if you insist."</p>
                            <p>
                              "Wonderful, sir. I'll have your luggage sent upstairs immediately."
                            </p>
                          </>
                      )}

                      {arrivalChoice === 'bold' && (
                          <>
                            <p>"I should hope so. I've had a rather exhausting day."</p>
                            <p>
                              "Of course, sir. Please accept our apologies for any inconvenience."
                            </p>
                          </>
                      )}

                      <p>You could ask more questions.</p>
                      <p>You could also remember that you've walked here, your feet are killing you, and someone has
                        just offered you a better room at no additional cost.</p>
                      <p>A room is a room. This one apparently comes with a promotion.</p>
                      <p>"Thank you."</p>
                      <p>"Shall I have someone take your luggage upstairs?"</p>
                      <p>You look at your suitcase.</p>
                      <p className="alex-reaction">Finally. Someone else can listen to that wheel.</p>
                      <p>
                        The bellhop reaches for your bags. You briefly consider warning him
                        about the handle held together with tape, but he's already picked them up.
                      </p>
                      <p>
                        You hear a suspicious ripping sound.
                      </p>
                      <p>
                        Neither of you acknowledges it.
                      </p>
                      <p>He leads you to an elevator with mirrored walls and buttons that look unnecessarily
                        expensive.</p>
                      <p>You spend the journey trying not to look like someone who's never been in an elevator with a
                        chandelier before.</p>
                      <p>Yes. An elevator chandelier.</p>
                      <p>Apparently, the regular chandeliers downstairs weren't enough.</p>
                      <p>The doors open.</p>
                      <p>The bellhop leads you down a quiet corridor and opens a pair of enormous doors.</p>
                      <p>"This will be your suite, Mr. Morgan."</p>
                      <p>You step inside.</p><p>The room is enormous.</p>
                      <p>There's a sitting area, a dining table, and a bathroom with a bathtub that appears to have its
                        own postcode.</p>
                      <p>You look around.</p>
                      <p>You could probably fit your old apartment in here.</p>
                      <p>Twice.</p>
                      <p>
                        You briefly wonder whether the hotel has confused
                        your reservation with someone else's.
                      </p>
                      <p>
                        Then you remember the receptionist checked.
                        Twice, practically.
                      </p>
                      <p>
                        Well. Who are you to question excellent customer service?
                      </p>
                      <p>The bellhop begins explaining the room's amenities.</p>
                      <p>Something about the minibar. A private dining service. A telephone that apparently connects you
                        directly to someone whose entire job is solving problems.</p>
                      <p>You wonder if they handle unemployment.</p>
                      <p>"Will there be anything else, sir?"</p><p>"No, thank you."</p>
                      <p>He leaves.</p><p>You stand in the middle of the suite for a moment.</p>
                      <p>Then you spot the bed.</p>
                      <p>It's enormous. It looks expensive. It has approximately fourteen pillows, which seems excessive
                        for a piece of furniture designed to accommodate one head.</p>
                      <p>You don't particularly care.</p>
                      <p>You drop your bags, take off your shoes, and collapse onto the mattress.</p>
                      <p>You have a job interview tomorrow.</p>
                      <p>You should probably review your notes.</p>
                      <p>You should probably set an alarm.</p>
                      <p>You should probably—</p><p>...</p>
                      <div className="chapter-end">ALEX HAS FALLEN ASLEEP.</div>
                      <button
                          className="primary-button"
                          onClick={() => setPage('chapters')}
                      >
                        The next morning →
                      </button>
                    </>
                )}
              </section>
          )}

          {page === 'chapters' && (
              <NextChapters
                  mbti={knowsMBTI ? selectedMBTI : mbtiAnswers.join('')}
              />
          )}

          <footer>
            <span>EVERY CHOICE HAS A CONSEQUENCE.</span>
            <span>
            {['intro', 'search', 'details', 'confirmed', 'transport', 'arrival'].indexOf(page) + 1} / 06
          </span>
          </footer>
        </div>
      </main>
  )
}

export default App
