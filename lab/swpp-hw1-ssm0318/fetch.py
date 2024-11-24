import urllib
import urllib.request
import urllib.error
import os

from functools import wraps

class BabyFetchException(Exception):
    """
    A custom exception for the cases where it fails to fetch the html file from the internet.
    """
    pass


def safe_internet_fetch(func):
    """
    (1 point)
    A decorator that catches fetching error (i.e. urllib.error.URLERROR) and raises a custom `BabyFetchException`.

    Args:
        func: The function to decorate
    Raises:
        BabyFetchException: if it fails to fetch the html codes from the url.
    """
    def inner(url, year):
        try:
            return func(url, year)
        except urllib.error.URLError:
            raise BabyFetchException("Request Failed")
    return inner
        


@safe_internet_fetch
def fetch_top_1000(url, year):
    """
    (2 points)
    Given a year of interest, fetches the html file from the top1000 popular names
    of that year and return the html codes in text

    Args:
        url: the target url to send request
        year: The year of interest in integer.
    Return:
        text: a string. HTML content of the fetch webpage.
    """
    params = "year=" + str(year) + "&top=1000"
    response = urllib.request.urlopen(url, data=params.encode())

    text = response.read().decode('utf-8')

    return text


def main():
    # NOTE: DO NOT change this function.
    # This function fetches and saves the html file of popular names in 2001-2018.
    # The example output html files are provided in `babydata/` directory.
    # The output html files you generate should be same with the provided example html files.
    # You can check the difference with `diff` command.    
    for year in range(2001, 2019):
        pathname = os.path.join("babydata", "{}.html".format(year))
        with open(pathname, "w") as f:
            url = "https://www.ssa.gov/cgi-bin/popularnames.cgi" # target url to fetch baby data 
            f.write(fetch_top_1000(url ,year))


if __name__ == '__main__':
    main()
