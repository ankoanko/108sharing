export default interface IPager {
  current_page: number
  next_page: null | number
  prev_page: null | number
  total_count: number
  total_pages: number
}
