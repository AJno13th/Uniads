#!/usr/bin/env python3
"""Write one day file per date from 9 Oct 2026 through 31 Dec 2026.

Figures are copied from content/brand-facts.md. Do not add numbers here that are
not in that file. Captions rotate so the same weekday is not identical every week.

Usage:
    python3 content/daily/generate_calendar.py
"""

from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
START = date(2026, 10, 9)
END = date(2026, 12, 31)
PHONE = "07368 218457"

# Launch-week files already exist and must not be overwritten.
SKIP = {date(2026, 9, d) for d in range(22, 29)}

WEEKDAYS = (
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
)

MONTHS = (
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
)


def pretty_date(d: date) -> str:
    return f"{WEEKDAYS[d.weekday()]} {d.day} {MONTHS[d.month]} {d.year}"


def week_index(d: date) -> int:
    return ((d - START).days // 7) % 4


def monday_frame(d: date) -> str:
    if d.month == 12:
        return "January intake"
    return "this intake"


# ---------------------------------------------------------------------------
# Caption banks. Index 0–3 rotates weekly. All figures from brand-facts.md.
# ---------------------------------------------------------------------------

NOQUALS = {
    "hook": "No qualifications needed, and you could start within days",
    "goal": "enquiries. Every post ends in a message, not a follow.",
    "tt_asset": "`assets/out/vid-noquals.mp4` (15s)",
    "ig_asset": "`assets/out/car-start-1.png` … `-6.png` (6 slides, in order)",
    "ig_kind": "Carousel",
    "fb_asset": "`assets/out/sq-noquals.png`",
    "tt_tags": "#NoALevels #UniUK #MatureStudentUK #BackToEducation #FundedDegree #CareerChange",
    "ig_tags": "#NoALevels #FundedDegree #MatureStudentUK #UniUK #BackToEducation #CareerChange #FoundationYear #ReturnToStudy",
    "internal": (
        "figures per [../brand-facts.md](../brand-facts.md) §4. 21+ work experience "
        "replaces formal quals at listed partners; do not name a partner as no-quals "
        "unless it appears that way in `src/data/universities.ts`."
    ),
    "tt": [
        "No GCSEs. No A-Levels. If you're 21+ your work experience is enough — and you could start this month.\n\nNo exams. No UCAS. We do the whole application for you, free.\n\nMessage us and we'll tell you what you can start.",
        "Left school at 16? That's not a closed door.\n\nAt 21+ our partner universities look at your work, not your grades. No exams. No UCAS. We handle the application, free.\n\nMessage us.",
        "The qualification you think you need? You don't.\n\n21 or over: work experience counts. Interview and a short assessment. You could start this month.\n\nMessage us and we'll check what you can start.",
        "Everyone told you that you needed A-Levels for uni. You don't.\n\n21+. Work experience. Two days a week. We do the application free.\n\nMessage us today.",
    ],
    "ig": [
        "You do not need the qualifications you think you need.\n\nIf you're 21 or over, our partner universities will look at your work experience instead. No exams. No UCAS. An interview and a short assessment, and you could be starting within days.\n\nHere's what you actually get:\n\n✓ A course matched to you\n✓ Your whole application handled\n✓ Interview prep\n✓ Student finance sorted for you\n✓ Two days a week — you pick mornings, evenings or weekends\n✓ Tuition covered, plus up to £16,000+ to live on if you're eligible\n\nAnd our part is free. You pay us nothing.\n\nPlaces for this intake are going. Send us a message and we'll tell you what you can start and when.",
        "If you left school without A-Levels, that is not the end of university.\n\nAt 21 or over, work and life experience can replace the grades you never sat. No exams. No UCAS. An interview, a short assessment, and you could start this month.\n\nWe match the course, handle the application, prep you for interview and sort student finance. Two days a week, you pick the days. Tuition covered, plus up to £16,000+ to live on if you're eligible.\n\nOur part costs you nothing. Message us.",
        "Stop waiting until you 'go back and get the quals'.\n\nYou don't need to. 21+ — your experience is the qualification. Foundation year routes, two days a week, tuition covered by a loan, up to £16,000+ to live on if you're eligible.\n\nWe do the whole application free. Send a message with your age, city and the subject you'd pick.",
        "No GCSEs. No A-Levels. Still going to university.\n\nThat's the route. Work experience at 21+, an interview and a short assessment. No UCAS. Two days a week around your job.\n\nTuition covered. Up to £16,000+ to live on if you're eligible. Extra grants if you have children.\n\nMessage us and we'll tell you what you can start.",
    ],
    "fb": [
        "No GCSEs. No A-Levels. You could still be starting university this month.\n\nIf you're 21 or over, our partner universities will assess you on your work and life experience instead of your grades. There's an interview and a short assessment — no exams, and no UCAS to deal with.\n\nWhat that looks like in practice:\n\n✓ Two days a week — you choose mornings, evenings or weekends, so you keep your job\n✓ Tuition covered by a tuition fee loan — nothing to pay upfront\n✓ Up to £16,000+ a year to live on while you study, if you're eligible\n✓ Extra grants if you have children — money you never pay back\n✓ Business Management, Health and Social Care, Computing, Construction Management, Cyber Security, Accounting and Finance and more\n✓ Campuses in London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton, Newcastle, Derby and Northampton\n\nAnd we do the whole thing for you — course choice, application, interview prep and your student finance. Free.\n\nPlaces for this intake are filling. Message us or call {phone} and we'll tell you today what you could start.",
        "You do not need A-Levels to start a degree.\n\nIf you're 21 or over, several of our partner universities will look at your work history instead of your grades. Interview. Short assessment. No exams. No UCAS.\n\nTwo days a week, you pick the days. Tuition covered by a tuition fee loan. Up to £16,000+ a year to live on if you're eligible. Childcare grants if you have kids — you never repay those.\n\nWe handle the application from start to finish. You pay us nothing.\n\nMessage us or call {phone}. Tell us your age, your city and what you'd want to study.",
        "Left school at 16 and wrote university off?\n\nAt 21+ that door opens again. Work experience replaces the quals you haven't got. Two days a week so you keep your job. Tuition covered. Up to £16,000+ to live on if you're eligible.\n\nBusiness Management, Health and Social Care, Computing, Construction Management, Cyber Security, Accounting and Finance, Psychology and Counselling, Law — funded, with foundation year routes.\n\nMessage us or call {phone}. We'll tell you straight what you could start.",
        "The thing blocking most people isn't ability. It's the belief they needed A-Levels.\n\nThey don't. 21 or over, work and life experience, an interview and a short assessment. That's the route. Two days a week. Tuition covered by a loan. Up to £16,000+ a year if you're eligible.\n\nWe do the application, interview prep and student finance. Free.\n\nMessage us or call {phone}.",
    ],
}

MONEY = {
    "hook": "The money — over £16,000 a year to study",
    "goal": "enquiries. This is the strongest single incentive in the offer.",
    "tt_asset": "`assets/out/vid-money.mp4` (15s)",
    "ig_asset": "`assets/out/car-money-1.png` … `-6.png` (6 slides)",
    "ig_kind": "Carousel",
    "fb_asset": "`assets/out/sq-money.png`",
    "tt_tags": "#StudentFinance #FundedDegree #MaintenanceLoan #MatureStudentUK #UniUK #BackToEducation",
    "ig_tags": "#StudentFinance #MaintenanceLoan #ChildcareGrant #FundedDegree #MatureStudentUK #UniUK #ReturnToStudy #StudentParent",
    "internal": (
        'figures per [../brand-facts.md](../brand-facts.md) §6 and §6c. "Up to" '
        "and \"if you're eligible\" stay in — they are what make the £16,000+ "
        "headline usable. Do not attach £16,000 to the maintenance loan alone."
    ),
    "tt": [
        "You could get over £16,000 a year while you study — if you're eligible.\n\nTuition covered. Living costs paid into your account. Extra on top if you have kids.\n\nWe do the paperwork. Message us and we'll work out your number.",
        "Tuition paid to the university. Living costs paid to you. Grants on top if you have children.\n\nPut together that's over £16,000 a year, if you're eligible.\n\nMessage us. We'll work out what you'd actually get.",
        "Most people have no idea how much money is sitting there to study on.\n\nOver £16,000 a year if you're eligible. Tuition covered separately. We fill in the forms, free.\n\nMessage us.",
        "You don't find the money. Student finance does.\n\nTuition loan to the university. Maintenance paid to you. Up to £16,000+ a year if you're eligible.\n\nMessage us and we'll run your numbers.",
    ],
    "ig": [
        "Let's talk about the money, because most people have no idea how much is there.\n\nTuition — up to £9,790, covered by a tuition fee loan paid straight to the university. Nothing upfront from you.\n\nLiving costs — up to £14,135 a year paid into your bank account each term if you study in London and live away from home. Less outside London, and it depends on your household income.\n\nGot children? Up to £199.62 a week towards childcare for one child, £342.24 for two or more. That's a grant. You never pay it back.\n\nAnd up to £2,024 a year in Parents' Learning Allowance on top. Also never repaid.\n\nAdd it up and you're comfortably over £16,000 a year, if you're eligible.\n\nWe fill in the forms with you. It costs you nothing. Send us a message and we'll tell you what you'd actually get.",
        "Here is the actual money. Not a headline — the breakdown.\n\nTuition fee loan — up to £9,790, paid to the university. You don't find that.\n\nMaintenance loan — up to £14,135 if you live away from home in London, lower outside London, and it depends on household income.\n\nParents' Learning Allowance — up to £2,024 a year. Never repaid.\n\nChildcare Grant — up to £199.62 a week for one child, £342.24 for two or more. Never repaid.\n\nThat's over £16,000 a year as a package, if you're eligible. We do the applications with you. Message us.",
        "You could study without paying anything upfront.\n\nTuition covered by a loan. Living costs paid into your account. Grants for parents that you never repay. Together, over £16,000 a year if you're eligible.\n\nTwo days a week so you keep your wages as well.\n\nMessage us and we'll work out your number. Free.",
        "The £16,000 isn't a loan we invented. It's the published support package if you're eligible: maintenance loan plus Parents' Learning Allowance, with childcare grants on top for parents.\n\nTuition is separate — up to £9,790, paid to the university.\n\nWe fill in every form with you. Send a message.",
    ],
    "fb": [
        "Most people have no idea how much money is available to study. Here it is.\n\nTuition — up to £9,790 a year, covered by a tuition fee loan paid directly to the university. You pay nothing upfront.\n\nLiving costs — up to £14,135 a year, paid into your bank account each term, if you study in London and live away from home. The amount outside London is lower and it depends on your household income.\n\nIf you have children:\n✓ Up to £199.62 a week towards childcare for one child, or £342.24 for two or more\n✓ Up to £2,024 a year in Parents' Learning Allowance\n\nBoth of those are grants. You never pay them back, and most parents we speak to have never heard of either.\n\nPut together, that's comfortably over £16,000 a year to study on, if you're eligible.\n\nWe fill in the student finance and childcare forms with you. Free.\n\nMessage us or call {phone} and we'll work out what you'd get.",
        "You don't need savings to start university.\n\nA tuition fee loan of up to £9,790 is paid to the university. A maintenance loan of up to £14,135 (London, living away) is paid to you, depending on household income. Parents can add a Childcare Grant of up to £199.62 a week for one child and Parents' Learning Allowance of up to £2,024 a year — both never repaid.\n\nThat's over £16,000 a year as a package, if you're eligible.\n\nMessage us or call {phone}. We'll run the numbers with you.",
        "The question isn't 'can I afford uni'. It's 'what would I actually receive'.\n\nTuition covered. Living costs paid to you. Grants for childcare and for parents that you never pay back. Over £16,000 a year if you're eligible.\n\nTwo days a week so your wages don't stop either.\n\nMessage us or call {phone}.",
        "Student finance is not a mystery once someone sits with you and fills in the forms.\n\nThat's what we do. Tuition loan, maintenance loan, Childcare Grant, Parents' Learning Allowance. Over £16,000 a year if you're eligible, with tuition on top.\n\nMessage us or call {phone}. One conversation.",
    ],
}

TWODAYS = {
    "hook": "Two days a week, and you choose which ones",
    "goal": 'kill the "I can\'t afford to stop working" objection',
    "tt_asset": "`assets/out/vid-2days.mp4` (14s)",
    "ig_asset": "`assets/out/vid-2days.mp4` as a Reel",
    "ig_kind": "Video",
    "fb_asset": "`assets/out/sq-2days.png`",
    "tt_tags": "#Study2DaysAWeek #UniUK #MatureStudentUK #CareerChange #BackToEducation #FundedDegree",
    "ig_tags": "#Study2DaysAWeek #WorkAndStudy #MatureStudentUK #UniUK #CareerChange #FundedDegree #ReturnToStudy #EveningClasses",
    "internal": (
        "2-days-a-week and the schedule options are per "
        "[../brand-facts.md](../brand-facts.md) §4 — they vary by partner, so keep it as "
        '"our partner programmes" rather than naming an institution.'
    ),
    "tt": [
        "University is two days a week. And you pick the days.\n\nMornings, evenings or weekends. Keep your job, keep your income, keep your life.\n\nYou could start this month. Message us.",
        "You don't quit work to get a degree.\n\nTwo days a week. You choose mornings, evenings or weekends. Five days stay yours.\n\nMessage us and we'll fit it around your week.",
        "Keep the job. Get the degree.\n\nTwo days a week, your choice of days. Tuition covered. Up to £16,000+ to live on if you're eligible.\n\nMessage us.",
        "The timetable is built around your life, not the other way round.\n\nTwo days a week. School runs, shifts, weekends — you pick.\n\nMessage us.",
    ],
    "ig": [
        "The reason most people never go isn't the studying. It's the money they'd lose by stopping work.\n\nSo don't stop.\n\nOur partner programmes run two days a week, and you choose which two. Mornings, evenings, weekends, or blended with online. Around school runs, around shifts, around whatever your week already looks like.\n\nFive days a week are still yours.\n\nTuition covered by a loan, up to £16,000+ a year to live on if you're eligible, and we handle the whole application for free.\n\nMessage us and we'll build it around your week.",
        "You can work and study. That's the point of two days a week.\n\nPick mornings, evenings or weekends. Keep your income. Keep your routine. Get the degree on the other two days.\n\nNo quals needed at 21+. Tuition covered. Up to £16,000+ if you're eligible. We do the application free.\n\nMessage us with what your week looks like.",
        "Five days a week are still yours.\n\nUniversity is two days, and you choose which two. That's how people with jobs, kids and rent actually do this.\n\nMessage us. We'll fit the timetable to you.",
        "If 'I can't stop working' is the reason you never applied — that reason is gone.\n\nTwo days a week. You pick the days. Keep the job. Get funded. We handle the paperwork.\n\nMessage us.",
    ],
    "fb": [
        '"I can\'t afford to stop working."\n\nYou don\'t have to. That\'s the whole point.\n\nOur partner programmes run two days a week — and you choose which two. Mornings, evenings, weekends, or blended with online study. It gets built around your shifts, your school runs and your commitments, not the other way round.\n\nSo you keep your job. You keep your income. And five days a week are still yours.\n\nOn top of that:\n✓ Tuition covered by a tuition fee loan — nothing upfront\n✓ Up to £16,000+ a year to live on while you study, if you\'re eligible\n✓ Extra grants if you have children, which you never repay\n✓ No qualifications needed if you\'re 21 or over\n✓ Campuses in ten cities, plus online and blended options\n\nWe handle the course choice, the application, the interview prep and your student finance. Free.\n\nMessage us or call {phone} and tell us what your week looks like. We\'ll fit it in.',
        "University that fits around a full-time job exists. It's two days a week, and you pick the days.\n\nMornings, evenings, weekends, or blended with online. You keep your wages. Tuition is covered by a loan. Up to £16,000+ a year to live on if you're eligible.\n\nNo formal qualifications needed at 21+.\n\nMessage us or call {phone}. Tell us your shifts and we'll tell you what fits.",
        "You don't need a career break to get a degree.\n\nTwo days a week. Keep the job. Keep the income. We handle the application and student finance, free.\n\nMessage us or call {phone}.",
        "Most of the people we sit with work. That's why the timetable is two days a week, chosen by you.\n\nIf your week already has school runs or night shifts, we build around them.\n\nMessage us or call {phone}.",
    ],
}

COURSES = {
    "hook": "The courses — pick the career, we find the course",
    "goal": "get people to self-select and name a subject in the DM",
    "tt_asset": "`assets/out/vid-courses.mp4` (16s)",
    "ig_asset": "`assets/out/car-courses-1.png` … `-6.png` (6 slides)",
    "ig_kind": "Carousel",
    "fb_asset": "`assets/out/sq-courses.png`",
    "tt_tags": "#FundedDegree #UniUK #MatureStudentUK #CareerChange #BackToEducation #HealthAndSocialCare",
    "ig_tags": "#FundedDegree #MatureStudentUK #UniUK #CareerChange #BackToEducation #FoundationYear #HealthAndSocialCare #BusinessDegree",
    "internal": (
        "subject list from [../brand-facts.md](../brand-facts.md) §5. Entry "
        "requirements differ by partner, so keep \"foundation year routes\" general and never "
        'promise a named institution will accept someone. If a commenter asks "which uni", '
        "move it to DM."
    ),
    "tt": [
        "What do you want to be?\n\nBusiness Management. Health and Social Care. Computing. Construction Management. Cyber Security. Accounting and Finance. Psychology and Counselling. Law.\n\nAll two days a week. All funded. No qualifications needed at 21+.\n\nComment the one you'd pick, or message us.",
        "Pick a career. We'll find the course.\n\nBusiness. Health and Social Care. Computing. Construction. Cyber Security. Accounting. Psychology. Law.\n\nFunded. Two days a week. Message us.",
        "Health and Social Care. Business Management. Computing. Construction Management. Cyber Security. Accounting and Finance.\n\nWhich one is yours? Comment it. We'll tell you where it runs and when it starts.",
        "You don't need to know the course title. You need to know the job you want.\n\nTell us that. We match the course, the campus and the funding.\n\nMessage us.",
    ],
    "ig": [
        "Pick the career. We'll find the course, the campus and the funding.\n\nBusiness Management · Health and Social Care · Computing · Construction Management · Cyber Security · Accounting and Finance · Psychology and Counselling · Criminology · Law · Digital Marketing · Project Management · Hospitality and Tourism\n\nEvery one of them:\n✓ Two days a week, your choice of days\n✓ Foundation year routes, so no qualifications needed at 21+\n✓ Tuition covered by a tuition fee loan\n✓ Up to £16,000+ a year to live on if you're eligible\n\nCampuses in London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton, Newcastle, Derby and Northampton — plus online and blended.\n\nComment the subject you'd pick and we'll tell you where you could study it and when it starts.",
        "Name the job. We'll name the course.\n\nBusiness Management, Health and Social Care, Computing, Construction Management, Cyber Security, Accounting and Finance, Psychology and Counselling, Criminology, Law, Digital Marketing, Project Management, Hospitality and Tourism.\n\nFunded. Two days a week. Foundation year routes at 21+ so you don't need the quals you think you need.\n\nComment the subject. We'll come back with campus and start date.",
        "If you've been stuck on 'I don't know what to study', start with the career instead.\n\nHealth and Social Care, Business, Computing, Construction, Cyber Security, Accounting, Psychology, Law — those are the ones people actually pick, and they're funded.\n\nMessage us with the one that fits. We'll do the rest.",
        "Fourteen partner institutions. Ten cities. The course is matched to you, not the other way round.\n\nNo quals needed at 21+ on foundation year routes. Two days a week. Tuition covered. Up to £16,000+ if you're eligible.\n\nComment the subject you'd pick.",
    ],
    "fb": [
        "What would you actually want to do?\n\nThat's the only question worth starting with. Once you've answered it, we'll find the course, the campus and the funding.\n\nBusiness Management. Health and Social Care. Computing. Construction Management. Cyber Security. Accounting and Finance. Psychology and Counselling. Criminology. Law. Digital Marketing. Project Management. Hospitality and Tourism.\n\nEvery one of them runs two days a week, with morning, evening and weekend options. Every one has a foundation year route, which means no formal qualifications needed if you're 21 or over. And tuition is covered by a tuition fee loan, with up to £16,000+ a year to live on if you're eligible.\n\nWe work with 14 partner institutions across London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton, Newcastle, Derby and Northampton, plus online and blended options.\n\nPlaces for this intake are filling now.\n\nTell us the career and we'll do the rest. Message us or call {phone}.",
        "Don't start with the university. Start with the career.\n\nHealth and Social Care, Business Management, Computing, Construction Management, Cyber Security, Accounting and Finance, Psychology and Counselling, Law and more — all funded, two days a week, foundation year routes at 21+.\n\nWe match the campus afterwards. Ten cities, plus online.\n\nMessage us or call {phone}. Tell us the job you want.",
        "If you can name the career, we can name the course, the city and the funding.\n\nThat's the whole job. You don't need to know UCAS codes or which partner runs what.\n\nMessage us or call {phone}.",
        "Business. Care. Computing. Construction. Cyber. Accounts. Psychology. Law.\n\nThose are real, funded degrees, two days a week, with no formal qualifications needed at 21+ on foundation year routes.\n\nMessage us or call {phone} and say which one you'd pick.",
    ],
}

KIDS = {
    "hook": "Studying with children, and the grants nobody mentions",
    "goal": "the highest-empathy, most shareable post of the week.",
    "tt_asset": "`assets/out/vid-money.mp4` (15s), or the SB-07 filmed version once it exists",
    "ig_asset": "`assets/out/car-kids-1.png` … `-5.png` (5 slides)",
    "ig_kind": "Carousel",
    "fb_asset": "`assets/out/sq-kids.png`",
    "tt_tags": "#ChildcareGrant #StudentParent #MatureStudentUK #UniUK #SingleMum #BackToEducation",
    "ig_tags": "#ChildcareGrant #StudentParent #ParentsLearningAllowance #MatureStudentUK #UniUK #SingleParent #ReturnToStudy #BackToEducation",
    "internal": (
        "Childcare Grant and PLA figures from [../brand-facts.md](../brand-facts.md) §6. "
        'The Childcare Grant is 85% of actual costs capped at those weekly amounts, so "up to" is doing necessary work — keep it.'
    ),
    "tt": [
        '"I\'ve got kids, I can\'t go to uni."\n\nThere\'s a grant for that. Up to £199.62 a week towards childcare for one child. £342.24 for two or more. Plus up to £2,024 a year on top.\n\nYou never pay either of them back. Most parents have never heard of them.\n\nTwo days a week, your choice of days. Message us.',
        "Parents can get paid to cover childcare while they study.\n\nUp to £199.62 a week for one child. £342.24 for two or more. Plus up to £2,024 a year. Grants. Never repaid.\n\nMessage us. We'll fill in the forms.",
        "The kids are the reason most parents don't apply. They're also the reason the grant exists.\n\nUp to £199.62 a week towards childcare. Two days a week, you pick the days.\n\nMessage us.",
        "You can study with children. There is money specifically for it, and you never pay it back.\n\nMessage us and we'll work out what you'd get.",
    ],
    "ig": [
        '"I can\'t. I\'ve got the kids."\n\nIt\'s the most common reason people give us. It\'s also the one with the clearest answer.\n\nChildcare Grant — up to £199.62 a week towards childcare for one child, or £342.24 a week for two or more. It\'s a grant, not a loan. You never pay it back.\n\nParents\' Learning Allowance — up to £2,024 a year on top, to help with the cost of studying. Also never repaid.\n\nAnd the timetable is two days a week, with you choosing the days. School hours, evenings or weekends. Built around your family rather than the other way round.\n\nAdd the maintenance loan and you\'re over £16,000 a year, if you\'re eligible — and tuition is covered separately by a loan.\n\nWe fill in the childcare forms with you. Free. Send us a message and we\'ll work out what you\'d get.',
        "If you have children, there is extra money to study that most people never hear about.\n\nChildcare Grant — up to £199.62 a week for one child, £342.24 for two or more. Parents' Learning Allowance — up to £2,024 a year. Both grants. Never repaid.\n\nTwo days a week around school. No quals needed at 21+. We do the forms.\n\nMessage us.",
        "Studying with kids is not a special case. It's a funded case.\n\nChildcare Grant. Parents' Learning Allowance. Two days a week you choose. Tuition covered. Over £16,000 a year if you're eligible.\n\nSend this to a parent who's been saying they can't. Then message us.",
        "The childcare bill is the blocker. The Childcare Grant is the answer — up to £199.62 a week for one child, £342.24 for two or more, never repaid.\n\nWe fill that form in with you. Message us.",
    ],
    "fb": [
        '"I\'ve got kids. I can\'t go to university."\n\nWe hear this more than anything else, and it has the clearest answer of all of them.\n\nThere is money specifically for parents who study, and almost nobody knows about it:\n\n✓ Childcare Grant — up to £199.62 a week towards childcare for one child, or £342.24 a week for two or more children\n✓ Parents\' Learning Allowance — up to £2,024 a year on top\n\nBoth of those are grants. Not loans. You never pay them back.\n\nAdd the maintenance loan and you\'re comfortably over £16,000 a year to study on, if you\'re eligible. Tuition is covered separately by a tuition fee loan, so there\'s nothing to find upfront.\n\nAnd the timetable is two days a week, with you choosing which days — school hours, evenings or weekends. It gets built around your family.\n\nIf you\'re 21 or over you don\'t need formal qualifications to start, and we handle the whole application including the childcare forms. Free.\n\nMessage us or call {phone} and we\'ll work out exactly what you\'d be entitled to. It takes one conversation.',
        "Parents are the people this is built for, not the exception.\n\nChildcare Grant up to £199.62 a week for one child, £342.24 for two or more. Parents' Learning Allowance up to £2,024 a year. Both never repaid. Two days a week around school.\n\nMessage us or call {phone}. We'll do the forms with you.",
        "If the only thing stopping you is childcare, that is a form, not a closed door.\n\nWe fill it in with you. Message us or call {phone}.",
        "Send this to a parent who thinks university isn't for people with kids.\n\nThere are grants for childcare and for parents that you never pay back. Two days a week. No quals needed at 21+.\n\nMessage us or call {phone}.",
    ],
}

UPGRADE = {
    "hook": "Change your life — the emotional one",
    "goal": "shares. This is the post built to be sent to someone. No figures, no feature lists.",
    "tt_asset": "`assets/out/vid-upgrade.mp4` (16s)",
    "ig_asset": "`assets/out/vid-upgrade.mp4` as a Reel",
    "ig_kind": "Video",
    "fb_asset": "Text only. No image.",
    "tt_tags": "#NeverTooLate #CareerChange #MatureStudentUK #UniUK #BackToEducation #NewChapter",
    "ig_tags": "#NeverTooLate #CareerChange #MatureStudentUK #UniUK #BackToEducation #ReturnToStudy #NewChapter #SelfDevelopment",
    "internal": (
        "deliberately no funding figures and no earnings claim — it is the emotional post. "
        '"Four years" refers to a foundation-year degree route per '
        "[../brand-facts.md](../brand-facts.md) §4."
    ),
    "tt": [
        "How long have you been meaning to do it?\n\nFour years from now you could have a degree. Or the exact same job.\n\nTwo days a week. You don't have to give anything up.\n\nSend this to someone who keeps saying they wish they'd gone.",
        "You don't need a new personality. You need a start date.\n\nTwo days a week. Keep your life. Change the next four years.\n\nSend this to whoever came to mind.",
        "The hard part isn't the studying. It's deciding it's allowed.\n\nIt is. Message us. Or send this to the person who needs to hear it.",
        "Same job in four years, or a degree in four years. That's the choice.\n\nTwo days a week. Message us.",
    ],
    "ig": [
        "Be honest about how long you've been meaning to do this.\n\nA year? Five? Since you left school?\n\nHere's the bit that gets people: four years from now, you could have a degree behind you. Or you could be in the exact same job, having the exact same conversation with yourself.\n\nThe difference isn't ability. It's that nobody ever told you it was possible without qualifications, without stopping work, and without paying anything upfront.\n\nIt is. Two days a week, your choice of days. We handle the whole application, free.\n\nSend this to whoever came to mind while you read it.",
        "Four years from now you will be four years older anyway.\n\nYou could have a degree. Or the same conversation with yourself.\n\nTwo days a week. No quals needed at 21+. We do the application free.\n\nSend this to the person you've been thinking about. Then message us.",
        "Nobody is coming to tap you on the shoulder and tell you it's your turn.\n\nThis is that tap. Two days a week. Keep your job. Start.\n\nMessage us.",
        "If you've been waiting to feel ready, you can stop waiting.\n\nReady is a start date. We can give you one.\n\nMessage us, or send this on.",
    ],
    "fb": [
        "Be honest with yourself about how long you've been meaning to do this.\n\nA year? Five? Since you left school?\n\nHere's what stops most people, and it isn't ability. It's that nobody ever told them it was possible — that you can start a degree at 21 or over without formal qualifications, two days a week, while keeping your job, with tuition covered and money to live on.\n\nFour years from now you could have a degree behind you. Or you could be in the same job having this same conversation with yourself again.\n\nWe've sat with a lot of people who left it years longer than they needed to, and not one of them said the hard part was the studying. The hard part was deciding it was allowed.\n\nIt's allowed.\n\nIf you want to know what it would look like from where you are right now, message us or call {phone}. It's free, and we'll tell you straight — including if the answer is no.\n\nAnd if you're reading this thinking of someone else, send it to them.",
        "The version of you in four years is coming either way.\n\nYou can meet them with a degree, or with the same job and the same 'I should have'.\n\nTwo days a week. You keep your life. We handle the application.\n\nMessage us or call {phone}. Or send this to the person who needs it more than you do.",
        "It's allowed. That's the whole post.\n\nUniversity at 21+ without the quals you thought you needed. Two days a week. Keep your job.\n\nMessage us or call {phone}.",
        "If you're reading this and thinking of someone else, send it. If you're reading it and thinking of yourself, message us or call {phone}.",
    ],
}


def start_bank(d: date) -> dict:
    """Monday: intake / start-soon. Not a fake 'last places' every week."""
    frame = monday_frame(d)
    jan = d.month == 12
    open_line_tt = (
        "January intake is the one to go for."
        if jan
        else "You could still start this month."
    )
    open_line_ig = (
        "January intake is open. If you've been waiting, this is the window."
        if jan
        else "Places for this intake are moving. If you've been reading and haven't messaged, this is the one."
    )
    open_line_fb = (
        "January intake is the next proper start. If you've been sitting on this, message this week."
        if jan
        else "If you've been reading these and haven't messaged yet, this is the one to act on."
    )
    return {
        "hook": f"{frame} — everything in one post",
        "goal": "convert viewers who haven't messaged yet. Do not invent a deadline.",
        "tt_asset": "`assets/out/vid-noquals.mp4` (15s)",
        "ig_asset": "`assets/out/car-start-1.png` … `-6.png` — reuse. A week later it reaches a different slice of a small audience.",
        "ig_kind": "Carousel",
        "fb_asset": "`assets/out/sq-noquals.png`",
        "tt_tags": "#FundedDegree #NoALevels #MatureStudentUK #UniUK #BackToEducation #ApplyNow",
        "ig_tags": "#FundedDegree #NoALevels #MatureStudentUK #UniUK #BackToEducation #CareerChange #ApplyNow #FoundationYear",
        "internal": (
            f"Urgency is '{frame}', not a fake last-call. Verify places are actually "
            "open before posting. Three-question ask (age, city, subject) maps to the qualifier."
        ),
        "tt": [
            f"{open_line_tt}\n\nNo qualifications needed at 21+. Two days a week, your choice of days. Tuition covered and up to £16,000+ to live on if you're eligible.\n\nWe do the whole application for you, free.\n\nMessage us today and we'll tell you what you can still start.",
            f"{open_line_tt}\n\n21+. Work experience. Two days a week. Funded.\n\nMessage us with your age, city and subject.",
            f"{open_line_tt}\n\nNo GCSEs. No A-Levels. Keep your job. We do the application.\n\nMessage us.",
            f"{open_line_tt}\n\nTell us age, city, subject. We'll tell you what you can start.\n\nMessage us.",
        ],
        "ig": [
            f"{open_line_ig}\n\nEverything in one place:\n\n✓ No formal qualifications needed if you're 21 or over — your work experience counts\n✓ No exams, no UCAS — an interview and a short assessment\n✓ Two days a week, and you choose the days. Mornings, evenings or weekends\n✓ Tuition covered by a tuition fee loan — nothing upfront\n✓ Up to £16,000+ a year to live on if you're eligible\n✓ Extra grants if you have children, which you never pay back\n✓ Business Management, Health and Social Care, Computing, Construction Management, Cyber Security, Accounting and Finance, Psychology and Counselling, Law and more\n✓ Ten cities, plus online and blended\n✓ We do the course choice, the application, the interview prep and the student finance — free\n\nOne message is all it takes. Tell us your age, your city and what you'd want to study, and we'll tell you what you could start.",
            f"{open_line_ig}\n\nNo quals at 21+. Two days a week. Tuition covered. Up to £16,000+ if you're eligible. Childcare grants if you have kids. We do the application free.\n\nMessage us: age, city, subject.",
            f"{open_line_ig}\n\nThat's the whole offer. Message us and we'll tell you what you can start.",
            f"{open_line_ig}\n\nAge. City. Subject. Three things. We'll come back today.\n\nMessage us.",
        ],
        "fb": [
            f"{open_line_fb}\n\n✓ No formal qualifications needed if you're 21 or over — we use your work and life experience instead\n✓ No exams and no UCAS — an interview and a short assessment\n✓ Two days a week, and you pick the days. Mornings, evenings or weekends, so you keep your job\n✓ Tuition covered by a tuition fee loan, so nothing to find upfront\n✓ Up to £16,000+ a year to live on while you study, if you're eligible\n✓ Childcare Grant and Parents' Learning Allowance if you have children — grants you never repay\n✓ Business Management, Health and Social Care, Computing, Construction Management, Cyber Security, Accounting and Finance, Psychology and Counselling, Criminology, Law and more\n✓ Campuses in London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton, Newcastle, Derby and Northampton, plus online and blended\n\nAnd we do the whole thing for you — matching the course, the application, interview preparation and your student finance from start to finish. Our part costs you nothing.\n\nSend us three things and we'll come back to you today: your age, your city, and what you'd want to study.\n\nMessage us or call {PHONE}.",
            f"{open_line_fb}\n\nNo quals at 21+. Two days a week. Funded. We handle the application.\n\nAge, city, subject — message us or call {PHONE}.",
            f"{open_line_fb}\n\nThat's everything. Message us or call {PHONE}.",
            f"{open_line_fb}\n\nOne conversation. Message us or call {PHONE}.",
        ],
    }


BY_WEEKDAY = {
    0: "start",  # Monday
    1: NOQUALS,  # Tuesday
    2: MONEY,  # Wednesday
    3: TWODAYS,  # Thursday
    4: COURSES,  # Friday
    5: KIDS,  # Saturday
    6: UPGRADE,  # Sunday
}


def render_day(d: date) -> str:
    bank = BY_WEEKDAY[d.weekday()]
    if bank == "start":
        bank = start_bank(d)
    v = week_index(d)
    tt = bank["tt"][v]
    ig = bank["ig"][v]
    fb = bank["fb"][v].replace("{phone}", PHONE)
    if bank["fb_asset"].startswith("Text"):
        fb_header = f"**{bank['fb_asset']}**"
    else:
        fb_header = f"**Image:** {bank['fb_asset']}"

    sound_tt = (
        "Add a trending sound at low volume in-app before posting. "
        "Silent uploads get suppressed. Pick on the day — tracks churn."
    )
    if d.weekday() == 6:
        sound_tt = (
            "Add a trending sound in-app. This post carries no figures, so the sound can sit a little higher."
        )

    ig_block = f"**{bank['ig_kind']}:** {bank['ig_asset']}"
    if bank["ig_kind"] == "Carousel":
        ig_sound = (
            "Keep it a carousel. Add music only if the composer shows **Add music**. "
            "Do not convert to a Reel just to force a sound."
        )
    else:
        ig_sound = "Add a trending sound in-app before posting."

    fb_sound = (
        "No sound on a photo post."
        if not bank["fb_asset"].startswith("Text")
        else "Text post — no sound."
    )

    return f"""# {pretty_date(d)}

**Hook:** {bank["hook"]}
**Goal:** {bank["goal"]}

---

## TikTok — 19:30

**Video:** {bank["tt_asset"]}

**Sound:** {sound_tt}

**Caption**

```
{tt}
```

**Hashtags**

```
{bank["tt_tags"]}
```

**CTA:** "Message us" → link in bio → uniads.co.uk

---

## Instagram — 20:00

{ig_block}

**Sound:** {ig_sound}

**Caption**

```
{ig}
```

**Hashtags**

```
{bank["ig_tags"]}
```

---

## Facebook — 19:00

{fb_header}

**Sound:** {fb_sound}

**Copy**

```
{fb}
```

**CTA:** WhatsApp {PHONE} · No hashtags on Facebook.

---

**Internal:** {bank["internal"]}
"""


HOOK_LABEL = {
    0: "Start / intake",
    1: "No qualifications",
    2: "Funding",
    3: "Two days a week",
    4: "Courses",
    5: "Studying with children",
    6: "Change your life",
}


def write_index(dates: list[date]) -> None:
    lines = [
        "# Posting calendar — 9 Oct to 31 Dec 2026",
        "",
        "One file per day. Facebook 19:00 · TikTok 19:30 · Instagram 20:00.",
        "Today is the file named with today's date. Start at "
        "[2026-10-09.md](2026-10-09.md).",
        "",
        "| Date | Day | Hook | File |",
        "| --- | --- | --- | --- |",
    ]
    for d in dates:
        label = HOOK_LABEL[d.weekday()]
        if d.weekday() == 0 and d.month == 12:
            label = "January intake"
        fname = f"{d.isoformat()}.md"
        lines.append(
            f"| {d.isoformat()} | {WEEKDAYS[d.weekday()]} | {label} | [{fname}]({fname}) |"
        )
    lines.append("")
    (ROOT / "CALENDAR.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    written = 0
    dates: list[date] = []
    d = START
    while d <= END:
        if d in SKIP:
            d += timedelta(days=1)
            continue
        path = ROOT / f"{d.isoformat()}.md"
        path.write_text(render_day(d), encoding="utf-8")
        dates.append(d)
        written += 1
        d += timedelta(days=1)
    write_index(dates)
    print(f"wrote {written} day files {START.isoformat()} → {END.isoformat()}")


if __name__ == "__main__":
    main()
