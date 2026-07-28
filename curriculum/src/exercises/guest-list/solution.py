def num_chancers_in_queue(queue, guest_list):
    count = 0

    for person in queue:
        if person not in guest_list:
            count = count + 1

    return count
