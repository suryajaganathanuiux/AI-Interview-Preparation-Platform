import React, { useState } from 'react'

import LandingPage from '../8uox3fJH8GxMb4tq8ho8ZZ.frame'
import SignIn from '../tAckc8nrqyvnLAza1cGJGm.frame'
import VerifyEmail from '../63qYQTZVYsCzeRom3VX7av.frame'
import Onboarding from '../cFaA4HyN3bSJPXSgToyVag.frame'
import Dashboard from '../kdvBb3fiFycz9FwrD1j9QU.frame'
import NovaCareerAgent from '../pY1NCinug3xocJX854215o.frame'
import DiscoverJobs from '../d9k279pNE3hHnunuC7LTF2.frame'
import JobDetails from '../q8huuubVdk998fbyJTrT76.frame'
import ResumeStudio from '../9ndNR2yduEibEEp4p4vJyx.frame'
import ApplicationTracker from '../rnmoSNsSgUGUeBv46u61hw.frame'
import InterviewStudio from '../3Gco5DpoMxW4pPrzT1RU68.frame'
import MockInterview from '../kzBMqPyDLb2DkfD6P7q3nY.frame'
import FeedbackReport from '../cubwbXpzqn6AsXQakwLAXC.frame'
import AnswerComparison from '../et9KJ2yW6cJ6UXP4D3Xk7d.frame'
import ProgressWeaknesses from '../hoXb5BW5wqkmeo3QXvSdZD.frame'
import QuestionBank from '../3ar6q3MLE1yyBoegpRrHbv.frame'
import TrustCenter from '../q1J6s8hx2uN2PDc5wgG79q.frame'
import AdminAIConfig from '../w6WZN5pqudeRgVbpvx6Zz9.frame'

const LANDING = '8uox3fJH8GxMb4tq8ho8ZZ'
const SIGN_IN = 'tAckc8nrqyvnLAza1cGJGm'
const VERIFY = '63qYQTZVYsCzeRom3VX7av'
const ONBOARDING = 'cFaA4HyN3bSJPXSgToyVag'
const DASHBOARD = 'kdvBb3fiFycz9FwrD1j9QU'
const NOVA = 'pY1NCinug3xocJX854215o'
const JOBS = 'd9k279pNE3hHnunuC7LTF2'
const JOB = 'q8huuubVdk998fbyJTrT76'
const RESUME = '9ndNR2yduEibEEp4p4vJyx'
const APPS = 'rnmoSNsSgUGUeBv46u61hw'
const STUDIO = '3Gco5DpoMxW4pPrzT1RU68'
const MOCK = 'kzBMqPyDLb2DkfD6P7q3nY'
const REPORT = 'cubwbXpzqn6AsXQakwLAXC'
const COMPARE = 'et9KJ2yW6cJ6UXP4D3Xk7d'
const PROGRESS = 'hoXb5BW5wqkmeo3QXvSdZD'
const BANK = '3ar6q3MLE1yyBoegpRrHbv'
const TRUST = 'q1J6s8hx2uN2PDc5wgG79q'
const ADMIN = 'w6WZN5pqudeRgVbpvx6Zz9'

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const args = {
  account: 'returning',
}

export const argTypes = {
  account: { control: 'radio', options: ['returning', 'new', 'incomplete'] },
}

export const folders = [
  { id: 'entry', name: 'Entry & onboarding', frames: [LANDING, SIGN_IN, VERIFY, ONBOARDING] },
  { id: 'home', name: 'Home & agent', frames: [DASHBOARD, NOVA] },
  { id: 'jobs', name: 'Jobs & applications', frames: [JOBS, JOB, RESUME, APPS] },
  { id: 'practice-loop', name: 'Interview practice', frames: [STUDIO, MOCK, REPORT, COMPARE] },
  { id: 'insight', name: 'Insight & library', frames: [PROGRESS, BANK] },
  { id: 'trust', name: 'Trust & admin', frames: [TRUST, ADMIN] },
]

type Props = Partial<typeof args> & { start?: string }

export default function AICareerCoach(props: Props) {
  const { account, start } = { ...args, ...props }
  const [screen, setScreen] = useState(() => start ?? LANDING)
  const [jobsTab, setJobsTab] = useState('recommended')
  const [retrying, setRetrying] = useState(false)
  const [onboardStep, setOnboardStep] = useState(1)
  const isNew = account === 'new'

  const nav = (key: string) => {
    const map: Record<string, string> = {
      dashboard: DASHBOARD,
      nova: NOVA,
      jobs: JOBS,
      'jobs-recommended': JOBS,
      'jobs-saved': JOBS,
      'job-detail': JOB,
      applications: APPS,
      resume: RESUME,
      studio: STUDIO,
      questions: BANK,
      feedback: REPORT,
      progress: PROGRESS,
      trust: TRUST,
      'admin-ai': ADMIN,
      signout: SIGN_IN,
    }
    if (key === 'jobs') setJobsTab('search')
    if (key === 'jobs-recommended') setJobsTab('recommended')
    if (key === 'jobs-saved') setJobsTab('saved')
    setRetrying(false)
    setScreen(map[key] ?? DASHBOARD)
  }

  switch (screen) {
    case SIGN_IN:
      return (
        <SignIn
          state="default"
          onHome={() => setScreen(LANDING)}
          onSubmit={(mode) => {
            if (mode === 'register') return setScreen(VERIFY)
            if (mode === 'google-register') {
              setOnboardStep(1)
              return setScreen(ONBOARDING)
            }
            if (account === 'incomplete') {
              setOnboardStep(5)
              return setScreen(ONBOARDING)
            }
            setScreen(DASHBOARD)
          }}
        />
      )
    case VERIFY:
      return (
        <VerifyEmail
          state="pending"
          onBack={() => setScreen(SIGN_IN)}
          onVerified={() => {
            setOnboardStep(1)
            setScreen(ONBOARDING)
          }}
        />
      )
    case ONBOARDING:
      return <Onboarding key={onboardStep} step={onboardStep} onFinish={() => setScreen(DASHBOARD)} onExit={() => setScreen(LANDING)} />
    case DASHBOARD:
      return <Dashboard state={isNew ? 'new' : 'default'} onNavigate={nav} />
    case NOVA:
      return <NovaCareerAgent onNavigate={nav} />
    case JOBS:
      return <DiscoverJobs key={jobsTab} tab={jobsTab} onNavigate={nav} />
    case JOB:
      return <JobDetails onNavigate={nav} />
    case RESUME:
      return <ResumeStudio onNavigate={nav} />
    case APPS:
      return <ApplicationTracker onNavigate={nav} />
    case STUDIO:
      return <InterviewStudio state="configure" onNavigate={nav} onStart={() => setScreen(MOCK)} />
    case MOCK:
      return (
        <MockInterview
          state={retrying ? 'retry' : 'answering'}
          onExit={() => setScreen(retrying ? REPORT : STUDIO)}
          onComplete={() => setScreen(retrying ? COMPARE : REPORT)}
        />
      )
    case REPORT:
      return (
        <FeedbackReport
          state="ready"
          onNavigate={nav}
          onRetry={() => {
            setRetrying(true)
            setScreen(MOCK)
          }}
          onCompare={() => setScreen(COMPARE)}
        />
      )
    case COMPARE:
      return <AnswerComparison onNavigate={nav} onBack={() => setScreen(REPORT)} />
    case PROGRESS:
      return <ProgressWeaknesses state={isNew ? 'insufficient' : 'default'} onNavigate={nav} onPractice={() => setScreen(STUDIO)} />
    case BANK:
      return <QuestionBank onNavigate={nav} onPractice={() => setScreen(MOCK)} />
    case TRUST:
      return <TrustCenter onNavigate={nav} />
    case ADMIN:
      return <AdminAIConfig onNavigate={nav} />
    default:
      return (
        <LandingPage
          onGetStarted={() => {
            setScreen(SIGN_IN)
          }}
          onLogin={() => setScreen(SIGN_IN)}
        />
      )
  }
}
