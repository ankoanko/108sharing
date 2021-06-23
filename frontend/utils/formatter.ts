function separate(stringNum: string): string {
  const len = stringNum.length

  if (len > 3) {
    return separate(stringNum.substring(0, len - 3)) + ',' + stringNum.substring(len - 3)
  } else {
    return stringNum
  }
}

export function formatPrice(price: number): string {
  return `¥${separate(String(price))}`
}
