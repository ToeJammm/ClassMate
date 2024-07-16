# Search Bar notes

All search bars are implemented in the same way, but we ended up copying the code for each search bar. This is not ideal, but it was the fastest way to implement the search bars.

They are implemented so that, if the search bar is in a request form, there is a `new value` saved. If the search bar is elsewhere, its use is to mainly navigate to a different, filtered page.

ClassSearchResultsList2 is the request form version, and ClassSearchResultsList is the navigation version. The rest of the search have navigation functionality if needed.
