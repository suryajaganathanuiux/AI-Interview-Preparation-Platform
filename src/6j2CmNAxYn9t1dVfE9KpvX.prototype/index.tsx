import React, { useState } from 'react'

import LandingPage from '../eFEJd7hwvCAzqJnkjnYxyT.frame'
import SignIn from '../c3xiSJ2xSMmjMQtKzTc4Uy.frame'
import VerifyEmail from '../8LHYgxoeNJRkDUuPyCvPUe.frame'
import Onboarding from '../b7gMGwExJpLmAuMqKWiANn.frame'
import Dashboard from '../iRXTzLfVtZx1yqZJej1BoS.frame'
import NovaCareerAgent from '../hFt5yjo61uC4DRYZEUzAZA.frame'
import DiscoverJobs from '../xeNCQAhvnht6JduJwoYzNc.frame'
import JobDetails from '../fAJNkv3dkhZf1NekeDF4Gw.frame'
import ResumeStudio from '../9t6F67X2HuizJYVkaD4KBN.frame'
import ApplicationTracker from '../76X7PRfipKDe9iYQW5HCMP.frame'
import InterviewStudio from '../eZLw6hVJ7RxYgrQn1ntsHK.frame'
import MockInterview from '../a7ARNNHtqq81apbFQWrW4v.frame'
import FeedbackReport from '../j7iUkWMsuVHSzBJU4QphYF.frame'
import AnswerComparison from '../i5wQ1SuJpJ2qTPfcANu343.frame'
import ProgressWeaknesses from '../mSfooBQtts4i8rFamJdywU.frame'
import QuestionBank from '../oV2Xqx6TAmwh7gBB2mfBwz.frame'
import TrustCenter from '../wQZqq49t5yybThLuVkFq6v.frame'
import AdminAIConfig from '../rWCXsJfgV5kCRCzzQjmSUT.frame'

const LANDING = 'eFEJd7hwvCAzqJnkjnYxyT'
const SIGN_IN = 'c3xiSJ2xSMmjMQtKzTc4Uy'
const VERIFY = '8LHYgxoeNJRkDUuPyCvPUe'
const ONBOARDING = 'b7gMGwExJpLmAuMqKWiANn'
const DASHBOARD = 'iRXTzLfVtZx1yqZJej1BoS'
const NOVA = 'hFt5yjo61uC4DRYZEUzAZA'
const JOBS = 'xeNCQAhvnht6JduJwoYzNc'
const JOB = 'fAJNkv3dkhZf1NekeDF4Gw'
const RESUME = '9t6F67X2HuizJYVkaD4KBN'
const APPS = '76X7PRfipKDe9iYQW5HCMP'
const STUDIO = 'eZLw6hVJ7RxYgrQn1ntsHK'
const MOCK = 'a7ARNNHtqq81apbFQWrW4v'
const REPORT = 'j7iUkWMsuVHSzBJU4QphYF'
const COMPARE = 'i5wQ1SuJpJ2qTPfcANu343'
const PROGRESS = 'mSfooBQtts4i8rFamJdywU'
const BANK = 'oV2Xqx6TAmwh7gBB2mfBwz'
const TRUST = 'wQZqq49t5yybThLuVkFq6v'
const ADMIN = 'rWCXsJfgV5kCRCzzQjmSUT'

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
