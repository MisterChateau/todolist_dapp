pragma solidity 0.4.24;


contract TodoList {
    struct Todo {
        bytes32 id;
        string content;
        bool completed;
    }

    struct Todos {
        Todo[] values;
    }

    event log(uint index);

    mapping(address => Todos) private users;

    function createTodo(string content) public returns (uint index) {
        Todo memory newTodo = Todo(generateId(content), content, false);
        // list already instantiated ????
        users[msg.sender].values.push(newTodo);

        return getLastTodoIndex();
    }

    function listEmpty() public view returns (bool empty) {
        return users[msg.sender].values.length == 0;
    }

    function getLastTodoIndex() public view returns (uint index) {
        require(!listEmpty(), "list empty");
        return users[msg.sender].values.length - 1;
    }

    function getLastTodo() public view returns (string content, bool completed, bytes32 id) {
        // shouldn't return list empty instead of invalid opcode ????
        require(!listEmpty(), "list empty");

        uint index = getLastTodoIndex();
        return getTodoAtIndex(index);
    }

    function getTodoAtIndex(uint index) public view returns (string content, bool completed, bytes32 id) {
        // shouldn't return list empty instead of invalid opcode ????
        require(!listEmpty(), "list empty");

        string storage _content = users[msg.sender].values[index].content;
        bool _completed = users[msg.sender].values[index].completed;
        bytes32 _id = users[msg.sender].values[index].id;

        return (_content, _completed, _id);
    }

    function toggleTodoCompletedStatusAtIndex(uint index) public returns (bool status) {
        users[msg.sender].values[index].completed = !users[msg.sender].values[index].completed;
        return users[msg.sender].values[index].completed;
    }

    function generateId(string content) private view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, content, now));
    }
}
