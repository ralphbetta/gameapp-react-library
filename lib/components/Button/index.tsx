import styles from './styles.module.css'

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...restProps } = props
  return <button className={`${className} ${styles.button} bg-purple-500`} {...restProps} />
}