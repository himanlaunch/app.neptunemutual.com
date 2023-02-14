import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import CheckBlue from '@/icons/CheckBlue'
import { classNames } from '@/utils/classnames'

export const AnalyticsDropdown = ({
  options,
  icon,
  direction = 'right',
  loading = false,
  labelClass = '',
  buttonClass = '',
  selected,
  setSelected
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div
        className='relative w-full'
      >
        <Listbox.Button
          className={classNames(
            'relative w-full pt-9px pb-9px pl-4 bg-f6f7f9 rounded-lg cursor-pointer pr-14 focus:outline-none focus-visible:border-4e7dd9',
            loading && 'cursor-not-allowed'
          )}
          data-testid='select-button'
        >
          <span className='block text-xs font-normal text-center truncate text-000000'>
            {selected?.label}
          </span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 text-xs pointer-events-none text-000000'>
            {icon}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options
            className={classNames(
              'absolute z-10 w-full mt-2 overflow-auto text-base bg-white border shadow-lightCard md:w-auto border-B0C4DB focus:outline-none focus-visible:border-4e7dd9 p-8 rounded-2xl',
              direction === 'right' && 'right-0',
              loading && 'hidden'
            )}
            data-testid='options-container'
          >
            {options.map((option, optionIdx) => (
              <Fragment key={optionIdx}>
                {option.type === 'label'
                  ? <> <hr className='h-px border-0 bg-B0C4DB dark:bg-B0C4DB' /> <Listbox.Label className='block pt-4 pb-2 pl-2 text-sm font-semibold leading-5 font-poppins text-000000'>{option.label}</Listbox.Label></>
                  : <ListChoice optionIdx={optionIdx} option={option} selected={selected} />}
              </Fragment>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

const ListChoice = ({ optionIdx, option, selected }) => {
  return (
    <Listbox.Option
      data-testid={`option-${optionIdx + 1}`}
      className={({ active }) =>
        classNames(
          'cursor-default select-none relative pb-2',
          active ? 'text-4e7dd9' : 'text-black'
        )}
      value={option}
    >
      {({ active }) => {
        return (
          <span
            className={classNames(
              'flex truncate pl-2 pr-16 py-2 capitalize rounded items-center justify-between leading-5 font-normal font-poppins text-sm text-000000 w-56',
              active ? 'bg-EEEEEE rounded-lg' : ''
            )}
          >
            {option.label} {selected.value === option.value && <CheckBlue className='absolute h-6 right-2 text-4e7dd9' />}
          </span>
        )
      }}
    </Listbox.Option>
  )
}
